import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import { ChangePaymentPage } from './change-payment-page';
import { ChangePaymentClient } from './change-payment-client';
import { ServiceStatus } from 'src/app/shared/client-status';
import { StripeIntent } from 'src/app/shared/stripe-payment-element/stripe-payment-setup-intent-model';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';
import { StripePaymentElement } from 'src/app/shared/stripe-payment-element/stripe-payment-element';

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

const makeAuth = () => ({
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

const makeReturnUrl = () => ({
  getSpecifiedUrlWithReturnUrl: vi.fn().mockReturnValue('/dashboard/change-payment/status'),
  openReturnURL: vi.fn(),
});

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('ChangePaymentPage', () => {
  let fixture: ComponentFixture<ChangePaymentPage>;
  let component: ChangePaymentPage;
  let stripeStub: StripePaymentElementStub;

  let authMock: ReturnType<typeof makeAuth>;
  let changePaymentService: ReturnType<typeof makeChangePaymentService>;
  let logService: ReturnType<typeof makeLogService>;
  let returnUrlService: ReturnType<typeof makeReturnUrl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePaymentPage],
      providers: [
        { provide: Auth,          useValue: makeAuth() },
        { provide: ChangePaymentClient, useValue: makeChangePaymentService() },
        { provide: Log,           useValue: makeLogService() },
        { provide: ReturnUrl,     useValue: makeReturnUrl() },
      ],
    })
      .overrideComponent(ChangePaymentPage, {
        remove: { imports: [StripePaymentElement] },
        add:    { imports: [StripePaymentElementStub] },
      })
      .compileComponents();

    authMock          = TestBed.inject(Auth)          as unknown as ReturnType<typeof makeAuth>;
    changePaymentService = TestBed.inject(ChangePaymentClient) as unknown as ReturnType<typeof makeChangePaymentService>;
    logService           = TestBed.inject(Log)           as unknown as ReturnType<typeof makeLogService>;
    returnUrlService     = TestBed.inject(ReturnUrl)     as unknown as ReturnType<typeof makeReturnUrl>;

    fixture   = TestBed.createComponent(ChangePaymentPage);
    component = fixture.componentInstance;

    // Step 1: render so afterNextRender fires and writes viewChild() → undefined,
    // and ngOnInit's fire-and-forget getChangePaymentSetupIntent() settles.
    await fixture.whenStable();

    // Step 2: now that afterNextRender has already fired, our set() is the last
    // write and won't be overwritten again.
    stripeStub = new StripePaymentElementStub();
    component.stripePaymentElementComponent.set(stripeStub as unknown as StripePaymentElement);

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
    expect(authMock.waitForAuth).toHaveBeenCalled();
    expect(changePaymentService.getChangePaymentSetupIntent).toHaveBeenCalled();
  });

  it('calls getChangePaymentSetupIntent from ngOnInit', async () => {
    // Fresh instance so we can spy before ngOnInit runs.
    const freshFixture = TestBed.createComponent(ChangePaymentPage);
    const freshComponent = freshFixture.componentInstance;
    const spy = vi.spyOn(freshComponent, 'getChangePaymentSetupIntent');

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
    authMock.waitForAuth.mockRejectedValueOnce(new Error('auth failed'));

    await component.getChangePaymentSetupIntent();

    expect(logService.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed'),
    );
  });

  it('does not fetch the setup intent when waitForAuth rejects', async () => {
    authMock.waitForAuth.mockRejectedValueOnce(new Error('auth failed'));
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