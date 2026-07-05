import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { StatusComponent } from './status.component';
import { StripeKeyService } from 'src/app/core/stripe/stripe-key.service';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  let authMock: { waitForAuth: ReturnType<typeof vi.fn> };
  let logMock: {
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  let stripeKeyServiceMock: { getPublicKey: ReturnType<typeof vi.fn> };
  let returnUrlMock: { openReturnURL: ReturnType<typeof vi.fn> };
  let retrieveSetupIntentMock: ReturnType<typeof vi.fn>;
  let stripeFactoryMock: ReturnType<typeof vi.fn>;

  const queryParams = {
    setup_intent: 'seti_123',
    setup_intent_client_secret: 'seti_123_secret_abc',
    redirect_status: 'succeeded'
  };

  function configureTestBed(paramOverrides: Partial<typeof queryParams> = {}): void {
    authMock = {
      waitForAuth: vi.fn().mockResolvedValue(undefined)
    };
    logMock = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    };
    stripeKeyServiceMock = {
      getPublicKey: vi.fn().mockReturnValue('pk_test_123')
    };
    // The real child components (succeeded/processing/requires-payment-method)
    // inject ReturnUrlService, whose real constructor needs APP_BASE_URL.
    // Mocking the service here avoids having to satisfy that token in tests
    // that don't care about return-URL behavior.
    returnUrlMock = {
      openReturnURL: vi.fn()
    };
    retrieveSetupIntentMock = vi.fn();
    stripeFactoryMock = vi.fn().mockReturnValue({
      retrieveSetupIntent: retrieveSetupIntentMock
    });
    (globalThis as any).Stripe = stripeFactoryMock;

    const mergedParams = { ...queryParams, ...paramOverrides };

    TestBed.configureTestingModule({
      imports: [StatusComponent],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: Log, useValue: logMock },
        { provide: StripeKeyService, useValue: stripeKeyServiceMock },
        { provide: ReturnUrl, useValue: returnUrlMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(mergedParams)
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    delete (globalThis as any).Stripe;
  });

  describe('successful setup intent', () => {
    beforeEach(() => {
      configureTestBed();
      retrieveSetupIntentMock.mockResolvedValue({ setupIntent: { status: 'succeeded' } });
    });

    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should set succeeded() to true and render the succeeded child component', async () => {
      await fixture.whenStable();

      expect(component.succeeded()).toBe(true);
      expect(component.processing()).toBe(false);
      expect(component.requires_payment_method()).toBe(false);
      expect(component.loading()).toBe(false);

      fixture.detectChanges();
      const succeededEl = fixture.nativeElement.querySelector('app-succeeded');
      expect(succeededEl).toBeTruthy();
    });

    it('should log a success message', async () => {
      await fixture.whenStable();

      expect(logMock.info).toHaveBeenCalledWith('Success! Your payment method has been saved.');
    });
  });

  describe('processing setup intent', () => {
    beforeEach(() => {
      configureTestBed();
      retrieveSetupIntentMock.mockResolvedValue({ setupIntent: { status: 'processing' } });
    });

    it('should set processing() to true and render the processing child component', async () => {
      await fixture.whenStable();

      expect(component.processing()).toBe(true);
      expect(component.succeeded()).toBe(false);
      expect(component.requires_payment_method()).toBe(false);

      fixture.detectChanges();
      const processingEl = fixture.nativeElement.querySelector('app-processing');
      expect(processingEl).toBeTruthy();
    });
  });

  describe('requires_payment_method setup intent', () => {
    beforeEach(() => {
      configureTestBed();
      retrieveSetupIntentMock.mockResolvedValue({ setupIntent: { status: 'requires_payment_method' } });
    });

    it('should set requires_payment_method() to true and render the requires-payment-method child component', async () => {
      await fixture.whenStable();

      expect(component.requires_payment_method()).toBe(true);
      expect(component.succeeded()).toBe(false);
      expect(component.processing()).toBe(false);

      fixture.detectChanges();
      const requiresEl = fixture.nativeElement.querySelector('app-requires-payment-method');
      expect(requiresEl).toBeTruthy();
    });

    it('should log an error message', async () => {
      await fixture.whenStable();

      expect(logMock.error).toHaveBeenCalledWith('Failed to process payment details. Please try another payment method.');
    });
  });

  describe('missing query params', () => {
    it('should log an error and not call retrieveSetupIntent when setup_intent_client_secret is missing', async () => {
      configureTestBed({ setup_intent_client_secret: undefined as any });
      await fixture.whenStable();

      expect(logMock.error).toHaveBeenCalledWith('Cannot display status because setup_intent_client_secret is undefined.');
      expect(retrieveSetupIntentMock).not.toHaveBeenCalled();
    });
  });

  describe('missing public key', () => {
    it('should log an error and not call Stripe when the public key is undefined', async () => {
      configureTestBed();
      stripeKeyServiceMock.getPublicKey.mockReturnValue(undefined);

      await fixture.whenStable();

      expect(logMock.error).toHaveBeenCalledWith('Cannot display status because publicKey is undefined.');
      expect(stripeFactoryMock).not.toHaveBeenCalled();
    });
  });

  describe('waitForAuth rejection', () => {
    it('should log an error when waitForAuth fails', async () => {
      configureTestBed();
      authMock.waitForAuth.mockRejectedValue(new Error('not authenticated'));

      await fixture.whenStable();

      expect(logMock.error).toHaveBeenCalledWith('waitForAuth failed: Error: not authenticated');
    });
  });
});