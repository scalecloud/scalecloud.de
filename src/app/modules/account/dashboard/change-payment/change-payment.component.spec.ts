import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import { ChangePaymentComponent } from './change-payment.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangePaymentService } from './change-payment.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { StripePaymentElementComponent } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-element.component';
import { StripeIntent } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-setup-intent';

// ── Stub ─────────────────────────────────────────────────────────────────────
// Declared with the same selector as the real component so Angular's template
// compiler replaces it. @ViewChild resolves by class token, so the stub must
// also extend the real class (or at minimum satisfy its public API).

@Component({
  selector: 'app-stripe-payment-element',
  template: '',
  standalone: true,
})
class StripePaymentElementStub {
  serviceStatus: ServiceStatus = ServiceStatus.Success;
  initPaymentElement = vi.fn();
  submitIntent = vi.fn();
}

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockAuthService = {
  waitForAuth: vi.fn().mockResolvedValue(void 0),
};

const mockChangePaymentService = {
  getChangePaymentSetupIntent: vi.fn().mockReturnValue(
    of({ clientsecret: 'test-secret', email: 'test@example.com' })
  ),
};

const mockLogService = {
  info: vi.fn(),
  error: vi.fn(),
};

const mockReturnUrlService = {
  getSpecifiedUrlWithReturnUrl: vi.fn().mockReturnValue('/dashboard/change-payment/status'),
  openReturnURL: vi.fn(),
};

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('ChangePaymentComponent', () => {
  let component: ChangePaymentComponent;
  let fixture: ComponentFixture<ChangePaymentComponent>;
  let stripeStub: StripePaymentElementStub;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ChangePaymentComponent],
      providers: [
        { provide: AuthService,          useValue: mockAuthService },
        { provide: ChangePaymentService, useValue: mockChangePaymentService },
        { provide: LogService,           useValue: mockLogService },
        { provide: ReturnUrlService,     useValue: mockReturnUrlService },
      ],
    })
    // Replace the real StripePaymentElementComponent with our stub so that
    // @ViewChild(StripePaymentElementComponent) resolves to the stub instance.
    .overrideComponent(ChangePaymentComponent, {
      remove: { imports: [StripePaymentElementComponent] },
      add:    { imports: [StripePaymentElementStub] },
    })
    .compileComponents();

    fixture   = TestBed.createComponent(ChangePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    stripeStub = component.stripePaymentElementComponent as unknown as StripePaymentElementStub;
  });

  afterEach(() => vi.clearAllMocks());

  // ── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── ngOnInit / getChangePaymentSetupIntent ─────────────────────────────────

  it('waits for auth before fetching the setup intent', async () => {
    expect(mockAuthService.waitForAuth).toHaveBeenCalled();
    expect(mockChangePaymentService.getChangePaymentSetupIntent).toHaveBeenCalled();
  });

  it('stores the setup intent reply on the component', () => {
    expect(component.subscriptionSetupIntentReply).toEqual({
      clientsecret: 'test-secret',
      email: 'test@example.com',
    });
  });

  it('initialises the Stripe payment element with the correct payload', () => {
    expect(stripeStub.initPaymentElement).toHaveBeenCalledWith({
      intent: StripeIntent.SetupIntent,
      client_secret: 'test-secret',
      email: 'test@example.com',
    });
  });

  it('logs an error when waitForAuth rejects', async () => {
    mockAuthService.waitForAuth.mockRejectedValueOnce(new Error('auth failed'));
    await component.getChangePaymentSetupIntent();
    expect(mockLogService.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed')
    );
  });

  // ── changePaymentMethod ────────────────────────────────────────────────────

  it('submits the payment intent with the return URL', () => {
    component.changePaymentMethod();
    expect(stripeStub.submitIntent).toHaveBeenCalledWith({
      return_url: '/dashboard/change-payment/status',
    });
  });

  it('logs the return URL before submitting', () => {
    component.changePaymentMethod();
    expect(mockLogService.info).toHaveBeenCalledWith(
      expect.stringContaining('/dashboard/change-payment/status')
    );
  });

  it('logs an error when the Stripe component is undefined', () => {
    component.stripePaymentElementComponent = undefined;
    component.changePaymentMethod();
    expect(mockLogService.error).toHaveBeenCalledWith(
      'PaymentElementComponent is undefined.'
    );
  });

  // ── cancel ─────────────────────────────────────────────────────────────────

  it('opens the return URL for /dashboard on cancel', () => {
    component.cancel();
    expect(mockReturnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  // ── isSuccess ──────────────────────────────────────────────────────────────

  it('returns true when Stripe element status is Success', () => {
    stripeStub.serviceStatus = ServiceStatus.Success;
    expect(component.isSuccess()).toBe(true);
  });

  it('returns false when Stripe element status is not Success', () => {
    stripeStub.serviceStatus = ServiceStatus.Error;
    expect(component.isSuccess()).toBe(false);
  });

  it('returns false when Stripe element component is undefined', () => {
    component.stripePaymentElementComponent = undefined;
    expect(component.isSuccess()).toBe(false);
  });
});