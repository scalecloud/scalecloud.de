import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

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
  // #address-element, with the 'ready'/'error'/'change' listeners attached).
  const createMountableElement = () => ({
    mount: vi.fn(),
    on: vi.fn(),
    addEventListener: vi.fn()
  });

  let paymentDomElement: ReturnType<typeof createMountableElement>;
  let addressDomElement: ReturnType<typeof createMountableElement>;
  let stripeElementsMock: { create: ReturnType<typeof vi.fn> };
  let stripeInstanceMock: {
    elements: ReturnType<typeof vi.fn>;
    confirmSetup: ReturnType<typeof vi.fn>;
    confirmPayment: ReturnType<typeof vi.fn>;
  };
  let stripeGlobalMock: ReturnType<typeof vi.fn>;

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

    stripeGlobalMock = vi.fn().mockReturnValue(stripeInstanceMock);
    (globalThis as any).Stripe = stripeGlobalMock;

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

  afterEach(() => {
    delete (globalThis as any).Stripe;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initPaymentElement', () => {
    it('should initialize Stripe with the public key and mount both elements', () => {
      component.initPaymentElement(initStripePayment);

      expect(stripeKeyMock.getPublicKey).toHaveBeenCalled();
      expect(stripeGlobalMock).toHaveBeenCalledWith('pk_test_123');
      expect(stripeInstanceMock.elements).toHaveBeenCalledWith(
        expect.objectContaining({ clientSecret: initStripePayment.client_secret })
      );
      expect(stripeElementsMock.create).toHaveBeenCalledWith('payment');
      expect(paymentDomElement.mount).toHaveBeenCalledWith('#payment-element');
      expect(addressDomElement.mount).toHaveBeenCalledWith('#address-element');
      expect(logMock.error).not.toHaveBeenCalled();
    });

    it('should set serviceStatus to Success when the element fires "ready"', () => {
      component.initPaymentElement(initStripePayment);

      const readyHandler = addressDomElement.on.mock.calls.find(([event]) => event === 'ready')?.[1];
      expect(readyHandler).toBeDefined();

      readyHandler();

      expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    });

    it('should set serviceStatus to Error and notify the snackbar when the element fires "error"', () => {
      component.initPaymentElement(initStripePayment);

      const errorHandler = addressDomElement.on.mock.calls.find(([event]) => event === 'error')?.[1];
      expect(errorHandler).toBeDefined();

      errorHandler({ error: { message: 'Something went wrong' } });

      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(snackBarMock.error).toHaveBeenCalledWith('Error loading Stripe: Something went wrong');
    });

    it('should display and report a validation error on "change" when the field is invalid', () => {
      const cardErrorsEl = document.createElement('div');
      cardErrorsEl.id = 'card-errors';
      document.body.appendChild(cardErrorsEl);

      component.initPaymentElement(initStripePayment);

      const changeHandler = addressDomElement.addEventListener.mock.calls.find(
        ([event]) => event === 'change'
      )?.[1];
      expect(changeHandler).toBeDefined();

      changeHandler({ error: { message: 'Invalid postal code' } });

      expect(cardErrorsEl.textContent).toBe('Invalid postal code');
      expect(snackBarMock.error).toHaveBeenCalledWith('Invalid postal code');

      document.body.removeChild(cardErrorsEl);
    });

    it('should clear the displayed error on "change" when the field becomes valid', () => {
      const cardErrorsEl = document.createElement('div');
      cardErrorsEl.id = 'card-errors';
      cardErrorsEl.textContent = 'previous error';
      document.body.appendChild(cardErrorsEl);

      component.initPaymentElement(initStripePayment);

      const changeHandler = addressDomElement.addEventListener.mock.calls.find(
        ([event]) => event === 'change'
      )?.[1];

      changeHandler({ error: null });

      expect(cardErrorsEl.textContent).toBe('');

      document.body.removeChild(cardErrorsEl);
    });

    it('should log an error and set an error state when the public key is undefined, without touching Stripe', () => {
      stripeKeyMock.getPublicKey.mockReturnValue(undefined);

      expect(() => component.initPaymentElement(initStripePayment)).not.toThrow();

      expect(logMock.error).toHaveBeenCalledWith(
        'Cannot display Payment because publicKey is undefined.'
      );
      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(stripeGlobalMock).not.toHaveBeenCalled();
      expect(component.initStripePayment).toBeUndefined();
    });
  });

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
      component.initStripePayment = { ...initStripePayment, intent: StripeIntent.SetupIntent };
      component.elements = stripeElementsMock;
      component.stripeElement = {
        confirmSetup: vi.fn().mockResolvedValue({ error: { message: 'Card declined' } }),
        confirmPayment: vi.fn()
      };

      await component.submitIntent(submitStripePayment);

      expect(component.stripeElement.confirmSetup).toHaveBeenCalledWith({
        elements: stripeElementsMock,
        confirmParams: { return_url: submitStripePayment.return_url }
      });
      expect(snackBarMock.error).toHaveBeenCalledWith('Card declined');
    });

    it('should call confirmPayment for a PaymentIntent and not show an error on success', async () => {
      component.initStripePayment = { ...initStripePayment, intent: StripeIntent.PaymentIntent };
      component.elements = stripeElementsMock;
      component.stripeElement = {
        confirmSetup: vi.fn(),
        confirmPayment: vi.fn().mockResolvedValue({})
      };

      await component.submitIntent(submitStripePayment);

      expect(component.stripeElement.confirmPayment).toHaveBeenCalledWith({
        elements: stripeElementsMock,
        confirmParams: { return_url: submitStripePayment.return_url }
      });
      expect(snackBarMock.error).not.toHaveBeenCalled();
    });
  });
});