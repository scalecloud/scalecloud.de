import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { ChangePaymentStatusPage } from './change-payment-status-page';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';
import { StripeKey } from 'src/app/core/stripe/stripe-key';

describe('ChangePaymentStatusPage', () => {
  let component: ChangePaymentStatusPage;
  let fixture: ComponentFixture<ChangePaymentStatusPage>;
  let logMock: {
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let stripeKeyMock: { getPublicKey: ReturnType<typeof vi.fn> };
  let retrieveSetupIntentMock: ReturnType<typeof vi.fn>;
  let stripeFactoryMock: ReturnType<typeof vi.fn>;
  let retrieveSetupIntentPromise: Promise<unknown> | undefined;

  const queryParams = {
    setup_intent: 'seti_123',
    setup_intent_client_secret: 'seti_123_secret_abc',
    redirect_status: 'succeeded',
  };

  function configureTestBed(paramOverrides: Partial<typeof queryParams> = {}): void {
    logMock = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    stripeKeyMock = {
      getPublicKey: vi.fn().mockReturnValue('pk_test_123'),
    };
    retrieveSetupIntentPromise = undefined;
    retrieveSetupIntentMock = vi.fn(() => {
      retrieveSetupIntentPromise = Promise.resolve({ setupIntent: { status: 'succeeded' } });
      return retrieveSetupIntentPromise;
    });
    stripeFactoryMock = vi.fn().mockReturnValue({
      retrieveSetupIntent: retrieveSetupIntentMock,
    });
    vi.stubGlobal('Stripe', stripeFactoryMock);

    const mergedParams = { ...queryParams, ...paramOverrides };

    TestBed.configureTestingModule({
      imports: [ChangePaymentStatusPage],
      providers: [
        { provide: Log, useValue: logMock },
        { provide: StripeKey, useValue: stripeKeyMock },
        {
          provide: ReturnUrl,
          useValue: { openReturnURL: vi.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(mergedParams),
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ChangePaymentStatusPage);
    component = fixture.componentInstance;
  }

  async function runStripeRequest(): Promise<void> {
    fixture.detectChanges();
    await retrieveSetupIntentPromise;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('creates the component', () => {
    configureTestBed();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('logs an error and does not call Stripe when the public key is missing', () => {
    configureTestBed();
    stripeKeyMock.getPublicKey.mockReturnValue(undefined);

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because publicKey is undefined.');
    expect(stripeFactoryMock).not.toHaveBeenCalled();
  });

  it('logs an error and does not retrieve the intent when setup_intent is missing', () => {
    configureTestBed({ setup_intent: undefined as any });

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because setup_intent is undefined.');
    expect(retrieveSetupIntentMock).not.toHaveBeenCalled();
  });

  it('logs an error and does not retrieve the intent when the client secret is missing', () => {
    configureTestBed({ setup_intent_client_secret: undefined as any });

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because setup_intent_client_secret is undefined.');
    expect(retrieveSetupIntentMock).not.toHaveBeenCalled();
  });

  it('logs an error and does not retrieve the intent when redirect_status is missing', () => {
    configureTestBed({ redirect_status: undefined as any });

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because redirect_status is undefined.');
    expect(retrieveSetupIntentMock).not.toHaveBeenCalled();
  });

  it('sets succeeded and clears loading when Stripe reports success', async () => {
    configureTestBed();
    retrieveSetupIntentMock.mockImplementation(() => {
      retrieveSetupIntentPromise = Promise.resolve({ setupIntent: { status: 'succeeded' } });
      return retrieveSetupIntentPromise;
    });

    await runStripeRequest();

    expect(component.succeeded()).toBe(true);
    expect(component.processing()).toBe(false);
    expect(component.requires_payment_method()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(logMock.info).toHaveBeenCalledWith('Success! Your payment method has been saved.');
  });

  it('sets processing and clears loading when Stripe reports processing', async () => {
    configureTestBed();
    retrieveSetupIntentMock.mockImplementation(() => {
      retrieveSetupIntentPromise = Promise.resolve({ setupIntent: { status: 'processing' } });
      return retrieveSetupIntentPromise;
    });

    await runStripeRequest();

    expect(component.processing()).toBe(true);
    expect(component.succeeded()).toBe(false);
    expect(component.requires_payment_method()).toBe(false);
    expect(component.loading()).toBe(false);
  });

  it('sets requires_payment_method and clears loading when Stripe requires another method', async () => {
    configureTestBed();
    retrieveSetupIntentMock.mockImplementation(() => {
      retrieveSetupIntentPromise = Promise.resolve({ setupIntent: { status: 'requires_payment_method' } });
      return retrieveSetupIntentPromise;
    });

    await runStripeRequest();

    expect(component.requires_payment_method()).toBe(true);
    expect(component.succeeded()).toBe(false);
    expect(component.processing()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(logMock.error).toHaveBeenCalledWith('Failed to process payment details. Please try another payment method.');
  });

  it('logs when retrieveSetupIntent rejects and leaves loading true', async () => {
    configureTestBed();
    retrieveSetupIntentMock.mockImplementation(() => {
      retrieveSetupIntentPromise = Promise.reject(new Error('Stripe unavailable'));
      return retrieveSetupIntentPromise;
    });

    fixture.detectChanges();
    await retrieveSetupIntentPromise?.catch(() => undefined);

    expect(logMock.error).toHaveBeenCalledWith(expect.stringContaining('retrieveSetupIntent failed'));
    expect(component.loading()).toBe(true);
  });
});