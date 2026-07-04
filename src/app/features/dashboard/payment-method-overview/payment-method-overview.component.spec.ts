import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, afterEach, it, expect, vi } from 'vitest';
import { PaymentMethodOverviewComponent } from './payment-method-overview.component';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { PaymentMethodOverviewService } from './payment-method-overview.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/core/logging/log.service';
import { ServiceStatus } from 'src/app/shared/service-status';
import { of, throwError } from 'rxjs';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';

const mockReply: PaymentMethodOverviewReply = {
  has_valid_payment_method: true,
  type: 'card',
  card: { brand: 'visa', last4: '4242', exp_month: 12, exp_year: 2026 },
  sepa_debit: { country: 'DE', last4: '1234' },
  paypal: { email: 'test@example.com' },
};

const paymentMethodServiceMock = {
  getPaymentMethodOverview: vi.fn(),
};

const authServiceMock = {
  waitForAuth: vi.fn(),
};

const logServiceMock = {
  error: vi.fn(),
};

const returnUrlServiceMock = {
  openUrlAddReturnUrl: vi.fn(),
};

/**
 * Fully resets the testing module and the mocks, then creates + settles a
 * fresh PaymentOverviewComponent.
 *
 * Every test calls this itself rather than sharing a fixture created in an
 * outer `beforeEach`. That's what actually prevents cross-test pollution —
 * `vi.resetAllMocks()` alone isn't enough if a stale `fixture`/`component`
 * from a previous test is still what a later test reads from.
 *
 * `authPending: true` gives `waitForAuth()` a promise that deliberately
 * never resolves, so tests asserting on the pre-load state don't depend on
 * winning a microtask race against the real auth/service chain.
 */
async function createComponent(
  options: {
    reply?: PaymentMethodOverviewReply;
    serviceError?: boolean;
    authError?: boolean;
    authPending?: boolean;
  } = {}
): Promise<{ fixture: ComponentFixture<PaymentMethodOverviewComponent>; component: PaymentMethodOverviewComponent }> {
  const { reply = mockReply, serviceError = false, authError = false, authPending = false } = options;

  vi.resetAllMocks();

  if (authPending) {
    authServiceMock.waitForAuth.mockReturnValue(new Promise<void>(() => {})); // never resolves
  } else if (authError) {
    authServiceMock.waitForAuth.mockRejectedValue(new Error('Auth failed'));
  } else {
    authServiceMock.waitForAuth.mockResolvedValue(undefined);
  }

  paymentMethodServiceMock.getPaymentMethodOverview.mockReturnValue(
    serviceError ? throwError(() => new Error('API error')) : of(reply)
  );

  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [PaymentMethodOverviewComponent],
    providers: [
      { provide: PaymentMethodOverviewService, useValue: paymentMethodServiceMock },
      { provide: AuthService, useValue: authServiceMock },
      { provide: LogService, useValue: logServiceMock },
      { provide: ReturnUrlService, useValue: returnUrlServiceMock },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(PaymentMethodOverviewComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component };
}

describe('PaymentOverviewComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  it('should reach Success status after loading', async () => {
    const { fixture, component } = await createComponent();
    await fixture.whenStable();
    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
  });

  it('should populate reply after loading', async () => {
    const { fixture, component } = await createComponent();
    await fixture.whenStable();
    expect(component.reply()).toEqual(mockReply);
  });

  describe('computed: payment type flags', () => {
    it('should detect credit card type', async () => {
      const { fixture, component } = await createComponent();
      await fixture.whenStable();

      expect(component.isCreditCard()).toBe(true);
      expect(component.isSEPA()).toBe(false);
      expect(component.isPayPal()).toBe(false);
    });

    it('should detect SEPA type', async () => {
      const { fixture, component } = await createComponent({ reply: { ...mockReply, type: 'sepa_debit' } });
      await fixture.whenStable();

      expect(component.isSEPA()).toBe(true);
      expect(component.isCreditCard()).toBe(false);
    });

    it('should detect PayPal type', async () => {
      const { fixture, component } = await createComponent({ reply: { ...mockReply, type: 'paypal' } });
      await fixture.whenStable();

      expect(component.isPayPal()).toBe(true);
      expect(component.isCreditCard()).toBe(false);
    });
  });

  describe('computed: paymentMethodDisplay', () => {
    it('should format card display correctly', async () => {
      const { fixture, component } = await createComponent();
      await fixture.whenStable();
      expect(component.paymentMethodDisplay()).toBe('**** **** **** 4242 - 12/2026');
    });

    it('should format SEPA debit display correctly', async () => {
      const { fixture, component } = await createComponent({ reply: { ...mockReply, type: 'sepa_debit' } });
      await fixture.whenStable();
      expect(component.paymentMethodDisplay()).toBe('DE** **** **** **** **12 34');
    });

    it('should return PayPal email as display', async () => {
      const { fixture, component } = await createComponent({ reply: { ...mockReply, type: 'paypal' } });
      await fixture.whenStable();
      expect(component.paymentMethodDisplay()).toBe('test@example.com');
    });
  });

  describe('computed: card brand flags', () => {
    it('should detect visa', async () => {
      const { fixture, component } = await createComponent();
      await fixture.whenStable();
      expect(component.isVisa()).toBe(true);
    });

    it('should detect amex', async () => {
      const { fixture, component } = await createComponent({
        reply: { ...mockReply, card: { ...mockReply.card, brand: 'amex' } },
      });
      await fixture.whenStable();
      expect(component.isAmericanExpress()).toBe(true);
      expect(component.isVisa()).toBe(false);
    });
  });

  describe('computed: cardBrand', () => {
    it('should capitalize the brand name', async () => {
      const { fixture, component } = await createComponent();
      await fixture.whenStable();
      expect(component.cardBrand()).toBe('Visa');
    });
  });

  describe('computed: hasPaymentMethod', () => {
    it('should return true when has_valid_payment_method is true', async () => {
      const { fixture, component } = await createComponent();
      await fixture.whenStable();
      expect(component.hasPaymentMethod()).toBe(true);
    });

    it('should return false when reply is null', async () => {
      const { component } = await createComponent({ authPending: true });
      // waitForAuth() never resolves here, so reply() is guaranteed to
      // still be null — no race against the async load chain.
      expect(component.reply()).toBeNull();
      expect(component.hasPaymentMethod()).toBe(false);
    });
  });

  it('should set Error status when service fails', async () => {
    const { fixture, component } = await createComponent({ serviceError: true });
    await fixture.whenStable();
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  it('should set Error status and log when waitForAuth fails', async () => {
    const { fixture, component } = await createComponent({ authError: true });
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logServiceMock.error).toHaveBeenCalledWith(expect.stringContaining('waitForAuth failed'));
  });

  it('should call returnUrlService when openUrlChangePaymentMethod is called', async () => {
    const { component } = await createComponent();
    component.openUrlChangePaymentMethod();
    expect(returnUrlServiceMock.openUrlAddReturnUrl).toHaveBeenCalledWith('/dashboard/change-payment');
  });
});