import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { describe, afterEach, it, expect, vi } from 'vitest';

import { ChangePaymentStatusPage } from './change-payment-status-page';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';
import { StripeKey } from 'src/app/core/stripe/stripe-key';

vi.mock('@stripe/stripe-js', () => ({ loadStripe: vi.fn() }));

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

  const queryParams = {
    setup_intent: 'seti_123',
    setup_intent_client_secret: 'seti_123_secret_abc',
    redirect_status: 'succeeded',
  };

  type QueryParamOverrides = Partial<Record<keyof typeof queryParams, string | undefined>>;

  function configureTestBed(
    paramOverrides: QueryParamOverrides = {},
    status = 'succeeded',
  ): void {
    logMock = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    stripeKeyMock = {
      getPublicKey: vi.fn().mockReturnValue('pk_test_123'),
    };
    retrieveSetupIntentMock = vi.fn().mockResolvedValue({ setupIntent: { status } });
    vi.mocked(loadStripe).mockReset();
    vi.mocked(loadStripe).mockResolvedValue({
      retrieveSetupIntent: retrieveSetupIntentMock,
    } as unknown as NonNullable<Awaited<ReturnType<typeof loadStripe>>>);

    TestBed.configureTestingModule({
      imports: [ChangePaymentStatusPage],
      providers: [
        { provide: Log, useValue: logMock },
        { provide: StripeKey, useValue: stripeKeyMock },
        { provide: ReturnUrl, useValue: { openReturnURL: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ ...queryParams, ...paramOverrides }),
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ChangePaymentStatusPage);
    component = fixture.componentInstance;
  }

  async function detectAndWaitForStatus(): Promise<void> {
    fixture.detectChanges();
    await component.checkPaymentIntentStatus();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.mocked(loadStripe).mockReset();
  });

  it('creates the component', () => {
    configureTestBed();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('logs an error and does not load Stripe when the public key is missing', () => {
    configureTestBed();
    stripeKeyMock.getPublicKey.mockReturnValue(undefined);

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because publicKey is undefined.');
    expect(loadStripe).not.toHaveBeenCalled();
  });

  it('logs an error and does not retrieve the intent when setup_intent is missing', () => {
    configureTestBed({ setup_intent: undefined });

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because setup_intent is undefined.');
    expect(loadStripe).not.toHaveBeenCalled();
  });

  it('logs an error and does not retrieve the intent when the client secret is missing', () => {
    configureTestBed({ setup_intent_client_secret: undefined });

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because setup_intent_client_secret is undefined.');
    expect(loadStripe).not.toHaveBeenCalled();
  });

  it('logs an error and does not retrieve the intent when redirect_status is missing', () => {
    configureTestBed({ redirect_status: undefined });

    fixture.detectChanges();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because redirect_status is undefined.');
    expect(loadStripe).not.toHaveBeenCalled();
  });

  it('sets succeeded and clears loading when Stripe reports success', async () => {
    configureTestBed({}, 'succeeded');

    await detectAndWaitForStatus();

    expect(component.succeeded()).toBe(true);
    expect(component.processing()).toBe(false);
    expect(component.requires_payment_method()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(logMock.info).toHaveBeenCalledWith('Success! Your payment method has been saved.');
  });

  it('sets processing and clears loading when Stripe reports processing', async () => {
    configureTestBed({}, 'processing');

    await detectAndWaitForStatus();

    expect(component.processing()).toBe(true);
    expect(component.succeeded()).toBe(false);
    expect(component.requires_payment_method()).toBe(false);
    expect(component.loading()).toBe(false);
  });

  it('sets requires_payment_method and clears loading when Stripe requires another method', async () => {
    configureTestBed({}, 'requires_payment_method');

    await detectAndWaitForStatus();

    expect(component.requires_payment_method()).toBe(true);
    expect(component.succeeded()).toBe(false);
    expect(component.processing()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(logMock.error).toHaveBeenCalledWith('Failed to process payment details. Please try another payment method.');
  });

  it('logs when loadStripe resolves null and leaves loading true', async () => {
    configureTestBed();
    vi.mocked(loadStripe).mockResolvedValue(null);

    await detectAndWaitForStatus();

    expect(logMock.error).toHaveBeenCalledWith('Cannot display status because Stripe.js could not be loaded.');
    expect(component.loading()).toBe(true);
  });

  it('logs a returned retrieveSetupIntent error and leaves loading true', async () => {
    configureTestBed();
    retrieveSetupIntentMock.mockResolvedValue({ error: { message: 'x' } });

    await detectAndWaitForStatus();

    expect(logMock.error).toHaveBeenCalledWith(expect.stringContaining('retrieveSetupIntent failed'));
    expect(component.loading()).toBe(true);
  });

  it('logs when retrieveSetupIntent rejects and leaves loading true', async () => {
    configureTestBed();
    retrieveSetupIntentMock.mockRejectedValue(new Error('Stripe unavailable'));

    await detectAndWaitForStatus();

    expect(logMock.error).toHaveBeenCalledWith(expect.stringContaining('retrieveSetupIntent failed'));
    expect(component.loading()).toBe(true);
  });
});