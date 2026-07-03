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

// ── Stub ──────────────────────────────────────────────────────────────────────

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

// ── Mock factories ────────────────────────────────────────────────────────────

const makeAuthService = () => ({
  waitForAuth: vi.fn().mockResolvedValue(void 0),
});

const makeChangePaymentService = () => ({
  getChangePaymentSetupIntent: vi.fn().mockReturnValue(
    of({ clientsecret: 'test-secret', email: 'test@example.com' })
  ),
});

const makeLogService = () => ({
  info: vi.fn(),
  error: vi.fn(),
});

const makeReturnUrlService = () => ({
  getSpecifiedUrlWithReturnUrl: vi.fn().mockReturnValue('/dashboard/change-payment/status'),
  openReturnURL: vi.fn(),
});

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('ChangePaymentComponent', () => {
  let fixture: ComponentFixture<ChangePaymentComponent>;
  let component: ChangePaymentComponent;
  let stripeStub: StripePaymentElementStub;

  let authService: ReturnType<typeof makeAuthService>;
  let changePaymentService: ReturnType<typeof makeChangePaymentService>;
  let logService: ReturnType<typeof makeLogService>;
  let returnUrlService: ReturnType<typeof makeReturnUrlService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePaymentComponent],
      providers: [
        { provide: AuthService,          useValue: makeAuthService() },
        { provide: ChangePaymentService, useValue: makeChangePaymentService() },
        { provide: LogService,           useValue: makeLogService() },
        { provide: ReturnUrlService,     useValue: makeReturnUrlService() },
      ],
    })
      .overrideComponent(ChangePaymentComponent, {
        remove: { imports: [StripePaymentElementComponent] },
        add:    { imports: [StripePaymentElementStub] },
      })
      .compileComponents();

    authService          = TestBed.inject(AuthService)          as unknown as ReturnType<typeof makeAuthService>;
    changePaymentService = TestBed.inject(ChangePaymentService) as unknown as ReturnType<typeof makeChangePaymentService>;
    logService           = TestBed.inject(LogService)           as unknown as ReturnType<typeof makeLogService>;
    returnUrlService     = TestBed.inject(ReturnUrlService)     as unknown as ReturnType<typeof makeReturnUrlService>;

    fixture   = TestBed.createComponent(ChangePaymentComponent);
    component = fixture.componentInstance;

    // Step 1: render so afterNextRender fires and writes viewChild() → undefined,
    // and ngOnInit's fire-and-forget getChangePaymentSetupIntent() settles.
    fixture.detectChanges();
    await fixture.whenStable();

    // Step 2: now that afterNextRender has already fired, our set() is the last
    // write and won't be overwritten again.
    stripeStub = new StripePaymentElementStub();
    component.stripePaymentElementComponent.set(stripeStub as unknown as StripePaymentElementComponent);

    // Step 3: re-run the init flow so it executes with the stub in place.
    // ngOnInit already ran in step 1 (with undefined), so we call it directly
    // and await the returned promise so the full chain — including the
    // .catch() branch in error tests — has actually resolved before assertions run.
    await component.getChangePaymentSetupIntent();
  });

  afterEach(() => vi.clearAllMocks());

  // ── Creation ───────────────────────────────────────────────────────────────

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  // ── ngOnInit / getChangePaymentSetupIntent ─────────────────────────────────

  it('waits for auth before fetching the setup intent', () => {
    // Called once in ngOnInit (step 1) and once in beforeEach step 3.
    expect(authService.waitForAuth).toHaveBeenCalled();
    expect(changePaymentService.getChangePaymentSetupIntent).toHaveBeenCalled();
  });

  it('calls getChangePaymentSetupIntent from ngOnInit', async () => {
    // Fresh instance so we can spy before ngOnInit runs.
    const freshFixture = TestBed.createComponent(ChangePaymentComponent);
    const freshComponent = freshFixture.componentInstance;
    const spy = vi.spyOn(freshComponent, 'getChangePaymentSetupIntent');

    freshFixture.detectChanges();
    await freshFixture.whenStable();

    expect(spy).toHaveBeenCalled();
  });

  it('returns a promise that resolves once the setup intent flow completes', async () => {
    await expect(component.getChangePaymentSetupIntent()).resolves.toBeUndefined();
  });

  it('stores the setup-intent reply on the component', () => {
    expect(component.subscriptionSetupIntentReply).toEqual({
      clientsecret: 'test-secret',
      email: 'test@example.com',
    });
  });

  it('initialises the Stripe element with the correct payload', () => {
    expect(stripeStub.initPaymentElement).toHaveBeenCalledWith({
      intent: StripeIntent.SetupIntent,
      client_secret: 'test-secret',
      email: 'test@example.com',
    });
  });

  it('does not throw when the Stripe element is undefined while the reply arrives', async () => {
    component.stripePaymentElementComponent.set(undefined);

    await expect(component.getChangePaymentSetupIntent()).resolves.toBeUndefined();
    // No init call possible without a Stripe element, and no error logged either
    // — this path is a normal race (view not yet rendered), not a failure.
    expect(logService.error).not.toHaveBeenCalled();
  });

  it('logs an error when waitForAuth rejects', async () => {
    authService.waitForAuth.mockRejectedValueOnce(new Error('auth failed'));

    await component.getChangePaymentSetupIntent();

    expect(logService.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed'),
    );
  });

  it('does not fetch the setup intent when waitForAuth rejects', async () => {
    authService.waitForAuth.mockRejectedValueOnce(new Error('auth failed'));
    changePaymentService.getChangePaymentSetupIntent.mockClear();

    await component.getChangePaymentSetupIntent();

    expect(changePaymentService.getChangePaymentSetupIntent).not.toHaveBeenCalled();
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

    expect(logService.info).toHaveBeenCalledWith(
      expect.stringContaining('/dashboard/change-payment/status'),
    );
  });

  it('logs an error when the Stripe component is undefined', () => {
    component.stripePaymentElementComponent.set(undefined);

    component.changePaymentMethod();

    expect(logService.error).toHaveBeenCalledWith(
      'PaymentElementComponent is undefined.',
    );
  });

  it('does not call submitIntent when the Stripe component is undefined', () => {
    component.stripePaymentElementComponent.set(undefined);

    component.changePaymentMethod();

    expect(stripeStub.submitIntent).not.toHaveBeenCalled();
  });

  // ── cancel ─────────────────────────────────────────────────────────────────

  it('navigates to /dashboard on cancel', () => {
    component.cancel();

    expect(returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  // ── isSuccess ──────────────────────────────────────────────────────────────

  it('returns true when the Stripe element status is Success', () => {
    stripeStub.serviceStatus = ServiceStatus.Success;

    expect(component.isSuccess()).toBe(true);
  });

  it('returns false when the Stripe element status is not Success', () => {
    stripeStub.serviceStatus = ServiceStatus.Error;

    expect(component.isSuccess()).toBe(false);
  });

  it('returns false when the Stripe element component is undefined', () => {
    component.stripePaymentElementComponent.set(undefined);

    expect(component.isSuccess()).toBe(false);
  });
});