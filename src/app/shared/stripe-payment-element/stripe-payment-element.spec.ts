import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

// loadStripe is called as a named import inside the component, so we mock the
// whole module (hoisted above all imports by Vitest) rather than spying on it.
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn()
}));

import { loadStripe } from '@stripe/stripe-js';
import { StripePaymentElement } from './stripe-payment-element';
import { ServiceStatus } from 'src/app/shared/client-status';
import { InitStripePayment, StripeIntent, SubmitStripePayment } from './stripe-payment-setup-intent-model';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { StripeKey } from 'src/app/core/stripe/stripe-key';

describe('StripePaymentElement', () => {
  let component: StripePaymentElement;
  let fixture: ComponentFixture<StripePaymentElement>;

  const logMock = {
    error: vi.fn()
  };

  const snackBarMock = {
    error: vi.fn()
  };

  const stripeKeyMock = {
    getPublicKey: vi.fn()
  };

  // Mock for the Stripe.js elements returned by `elements.create(...)`.
  // The component calls elements.create('payment') first (mounted at
  // #payment-element) and elements.create('address', ...) second (mounted at
  // #address-element, with the 'ready'/'loaderror' listeners attached).
  const createMountableElement = () => ({
    mount: vi.fn(),
    on: vi.fn()
  });

  let paymentDomElement: ReturnType<typeof createMountableElement>;
  let addressDomElement: ReturnType<typeof createMountableElement>;
  let stripeElementsMock: { create: ReturnType<typeof vi.fn> };
  let stripeInstanceMock: {
    elements: ReturnType<typeof vi.fn>;
    confirmSetup: ReturnType<typeof vi.fn>;
    confirmPayment: ReturnType<typeof vi.fn>;
  };
  const loadStripeMock = vi.mocked(loadStripe);

  const initStripePayment: InitStripePayment = {
    intent: StripeIntent.PaymentIntent,
    client_secret: 'secret_123',
    email: 'test@example.com'
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    paymentDomElement = createMountableElement();
    addressDomElement = createMountableElement();

    stripeElementsMock = {
      create: vi.fn((type: string) => (type === 'payment' ? paymentDomElement : addressDomElement))
    };

    stripeInstanceMock = {
      elements: vi.fn().mockReturnValue(stripeElementsMock),
      confirmSetup: vi.fn().mockResolvedValue({}),
      confirmPayment: vi.fn().mockResolvedValue({})
    };

    loadStripeMock.mockResolvedValue(stripeInstanceMock as any);

    stripeKeyMock.getPublicKey.mockReturnValue('pk_test_123');

    await TestBed.configureTestingModule({
      imports: [StripePaymentElement],
      providers: [
        { provide: Log, useValue: logMock },
        { provide: SnackBar, useValue: snackBarMock },
        { provide: StripeKey, useValue: stripeKeyMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StripePaymentElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── initPaymentElement ─────────────────────────────────────────────────────

  describe('initPaymentElement', () => {
    it('should initialize Stripe with the public key and mount both elements', async () => {
      await component.initPaymentElement(initStripePayment);

      expect(stripeKeyMock.getPublicKey).toHaveBeenCalled();
      expect(loadStripeMock).toHaveBeenCalledWith('pk_test_123');
      expect(stripeInstanceMock.elements).toHaveBeenCalledWith(
        expect.objectContaining({ clientSecret: initStripePayment.client_secret })
      );
      expect(stripeElementsMock.create).toHaveBeenCalledWith('payment');
      expect(paymentDomElement.mount).toHaveBeenCalledWith('#payment-element');
      expect(addressDomElement.mount).toHaveBeenCalledWith('#address-element');
      expect(logMock.error).not.toHaveBeenCalled();
    });

    it('should set serviceStatus to Success when the element fires "ready"', async () => {
      await component.initPaymentElement(initStripePayment);

      const readyHandler = addressDomElement.on.mock.calls.find(([event]) => event === 'ready')?.[1];
      expect(readyHandler).toBeDefined();

      readyHandler();

      expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    });

    it('should set serviceStatus to Error and notify the snackbar when the element fires "loaderror"', async () => {
      await component.initPaymentElement(initStripePayment);

      const loadErrorHandler = addressDomElement.on.mock.calls.find(([event]) => event === 'loaderror')?.[1];
      expect(loadErrorHandler).toBeDefined();

      loadErrorHandler({ error: { message: 'Something went wrong' } });

      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(snackBarMock.error).toHaveBeenCalledWith('Error loading Stripe: Something went wrong');
    });

    it('should log an error and set an error state when the public key is undefined, without touching Stripe', async () => {
      stripeKeyMock.getPublicKey.mockReturnValue(undefined);

      await expect(component.initPaymentElement(initStripePayment)).resolves.not.toThrow();

      expect(logMock.error).toHaveBeenCalledWith(
        'Cannot display Payment because publicKey is undefined.'
      );
      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(loadStripeMock).not.toHaveBeenCalled();
      expect(component.initStripePayment).toBeUndefined();
    });

    it('should log an error and set an error state when Stripe.js fails to load', async () => {
      loadStripeMock.mockResolvedValue(null);

      await component.initPaymentElement(initStripePayment);

      expect(logMock.error).toHaveBeenCalledWith(
        'Cannot display Payment because Stripe.js failed to load.'
      );
      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    });
  });

  // ─── submitIntent ───────────────────────────────────────────────────────────

  describe('submitIntent', () => {
    const submitStripePayment: SubmitStripePayment = { return_url: 'https://example.com/return' };

    it('should log an error and not call Stripe when initStripePayment is undefined', async () => {
      component.initStripePayment = undefined;

      await component.submitIntent(submitStripePayment);

      expect(logMock.error).toHaveBeenCalledWith(
        'Cannot submit Payment because initStripePayment is undefined.'
      );
    });

    it('should call confirmSetup for a SetupIntent and show an error on failure', async () => {
      await component.initPaymentElement(initStripePayment);
      component.initStripePayment = { ...initStripePayment, intent: StripeIntent.SetupIntent };
      stripeInstanceMock.confirmSetup.mockResolvedValue({ error: { message: 'Card declined' } });

      await component.submitIntent(submitStripePayment);

      expect(stripeInstanceMock.confirmSetup).toHaveBeenCalledWith({
        elements: stripeElementsMock,
        confirmParams: { return_url: submitStripePayment.return_url }
      });
      expect(snackBarMock.error).toHaveBeenCalledWith('Card declined');
    });

    it('should call confirmPayment for a PaymentIntent and not show an error on success', async () => {
      await component.initPaymentElement(initStripePayment);
      component.initStripePayment = { ...initStripePayment, intent: StripeIntent.PaymentIntent };

      await component.submitIntent(submitStripePayment);

      expect(stripeInstanceMock.confirmPayment).toHaveBeenCalledWith({
        elements: stripeElementsMock,
        confirmParams: { return_url: submitStripePayment.return_url }
      });
      expect(snackBarMock.error).not.toHaveBeenCalled();
    });
  });
});