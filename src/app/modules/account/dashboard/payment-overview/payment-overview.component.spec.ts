import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { PaymentOverviewComponent } from './payment-overview.component';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { PaymentMethodOverviewService } from './payment-method-overview.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { of, throwError } from 'rxjs';

const mockReply: PaymentMethodOverviewReply = {
  has_valid_payment_method: true,
  type: 'card',
  card: { brand: 'visa', last4: '4242', exp_month: 12, exp_year: 2026 },
  sepa_debit: { country: 'DE', last4: '1234' },
  paypal: { email: 'test@example.com' },
};

const paymentMethodServiceMock = {
  getPaymentMethodOverview: vi.fn().mockReturnValue(of(mockReply)),
};

const authServiceMock = {
  waitForAuth: vi.fn().mockResolvedValue(undefined),
};

const logServiceMock = {
  error: vi.fn(),
};

const returnUrlServiceMock = {
  openUrlAddReturnUrl: vi.fn(),
};

describe('PaymentOverviewComponent', () => {
  let component: PaymentOverviewComponent;
  let fixture: ComponentFixture<PaymentOverviewComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [PaymentOverviewComponent],
      providers: [
        { provide: PaymentMethodOverviewService, useValue: paymentMethodServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LogService, useValue: logServiceMock },
        { provide: ReturnUrlService, useValue: returnUrlServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reach Success status after loading', async () => {
    await fixture.whenStable();
    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
  });

  it('should populate reply after loading', async () => {
    await fixture.whenStable();
    expect(component.reply()).toEqual(mockReply);
  });

  describe('computed: payment type flags', () => {
    beforeEach(async () => await fixture.whenStable());

    it('should detect credit card type', () => {
      expect(component.isCreditCard()).toBe(true);
      expect(component.isSEPA()).toBe(false);
      expect(component.isPayPal()).toBe(false);
    });

    it('should detect SEPA type', async () => {
      paymentMethodServiceMock.getPaymentMethodOverview.mockReturnValue(
        of({ ...mockReply, type: 'sepa_debit' })
      );
      fixture = TestBed.createComponent(PaymentOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.isSEPA()).toBe(true);
      expect(component.isCreditCard()).toBe(false);
    });

    it('should detect PayPal type', async () => {
      paymentMethodServiceMock.getPaymentMethodOverview.mockReturnValue(
        of({ ...mockReply, type: 'paypal' })
      );
      fixture = TestBed.createComponent(PaymentOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.isPayPal()).toBe(true);
      expect(component.isCreditCard()).toBe(false);
    });
  });

  describe('computed: paymentMethodDisplay', () => {
    beforeEach(async () => await fixture.whenStable());

    it('should format card display correctly', () => {
      expect(component.paymentMethodDisplay()).toBe('**** **** **** 4242 - 12/2026');
    });

    it('should format SEPA debit display correctly', async () => {
      paymentMethodServiceMock.getPaymentMethodOverview.mockReturnValue(
        of({ ...mockReply, type: 'sepa_debit' })
      );
      fixture = TestBed.createComponent(PaymentOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.paymentMethodDisplay()).toBe('DE** **** **** **** **12 34');
    });

    it('should return PayPal email as display', async () => {
      paymentMethodServiceMock.getPaymentMethodOverview.mockReturnValue(
        of({ ...mockReply, type: 'paypal' })
      );
      fixture = TestBed.createComponent(PaymentOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.paymentMethodDisplay()).toBe('test@example.com');
    });
  });

  describe('computed: card brand flags', () => {
    beforeEach(async () => await fixture.whenStable());

    it('should detect visa', () => expect(component.isVisa()).toBe(true));
    it('should detect amex', async () => {
      paymentMethodServiceMock.getPaymentMethodOverview.mockReturnValue(
        of({ ...mockReply, card: { ...mockReply.card, brand: 'amex' } })
      );
      fixture = TestBed.createComponent(PaymentOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.isAmericanExpress()).toBe(true);
      expect(component.isVisa()).toBe(false);
    });
  });

  describe('computed: cardBrand', () => {
    beforeEach(async () => await fixture.whenStable());

    it('should capitalize the brand name', () => {
      expect(component.cardBrand()).toBe('Visa');
    });
  });

  describe('computed: hasPaymentMethod', () => {
    it('should return true when has_valid_payment_method is true', async () => {
      await fixture.whenStable();
      expect(component.hasPaymentMethod()).toBe(true);
    });

    it('should return false when reply is null', () => {
      expect(component.hasPaymentMethod()).toBe(false);
    });
  });

  it('should set Error status when service fails', async () => {
    paymentMethodServiceMock.getPaymentMethodOverview.mockReturnValue(
      throwError(() => new Error('API error'))
    );
    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  it('should set Error status and log when waitForAuth fails', async () => {
    authServiceMock.waitForAuth.mockRejectedValue(new Error('Auth failed'));
    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logServiceMock.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed')
    );
  });

  it('should call returnUrlService when openUrlChangePaymentMethod is called', () => {
    component.openUrlChangePaymentMethod();
    expect(returnUrlServiceMock.openUrlAddReturnUrl).toHaveBeenCalledWith('/dashboard/change-payment');
  });
});