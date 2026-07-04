import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { VerifyEmailComponent } from './verify-email.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { signal } from '@angular/core';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeUser(overrides: Partial<{ email: string }> = {}) {
  return { email: 'user@example.com', ...overrides };
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;

  // Mocks
  const userSignal = signal<any>(makeUser());
  const authService = {
    user: userSignal,
    sendVerificationMail: vi.fn(),
    reloadUser: vi.fn(() => Promise.resolve()),
    isLoggedIn: vi.fn(() => Promise.resolve(true)),
  };
  const returnUrlService = { openReturnURL: vi.fn() };
  const snackBarService = { error: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    authService.reloadUser.mockResolvedValue(undefined);
    authService.isLoggedIn.mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ReturnUrlService, useValue: returnUrlService },
        { provide: SnackBarService, useValue: snackBarService },
      ],
    }).compileComponents();

    // Fake timers are installed *after* TestBed setup (which relies on real
    // timers/microtasks to compile and resolve) but *before* the fixture is
    // created, since ngOnInit() kicks off the resend cooldown's setInterval
    // immediately. We use detectChanges() (synchronous) rather than
    // whenStable() here, because whenStable()'s zoneless stability check can
    // itself be backed by a real setTimeout/polling internally — which fake
    // timers would freeze forever, hanging the test past the hook timeout.
    vi.useFakeTimers();

    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  it('should initialise isProceedToCheckoutLoading as false', () => {
    expect(component.isProceedToCheckoutLoading()).toBe(false);
  });

  it('should start the resend cooldown on init', () => {
    expect(component.isResendDisabled()).toBe(true);
  });

  it('should show the countdown in the resend button text on init', () => {
    expect(component.resendButtonText()).toBe('Resend Verification E-Mail (30)');
  });

  // ─── Resend cooldown countdown ───────────────────────────────────────────────

  it('should count down the cooldown by one each second', () => {
    vi.advanceTimersByTime(1000);
    expect(component.resendButtonText()).toBe('Resend Verification E-Mail (29)');

    vi.advanceTimersByTime(1000);
    expect(component.resendButtonText()).toBe('Resend Verification E-Mail (28)');
  });

  it('should re-enable the resend button once the cooldown reaches zero', () => {
    vi.advanceTimersByTime(30_000);
    expect(component.isResendDisabled()).toBe(false);
    expect(component.resendButtonText()).toBe('Resend Verification E-Mail');
  });

  it('should not go below zero seconds remaining', () => {
    vi.advanceTimersByTime(60_000);
    expect(component.resendButtonText()).toBe('Resend Verification E-Mail');
    expect(component.isResendDisabled()).toBe(false);
  });

  it('should clear the interval once the cooldown completes', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    vi.advanceTimersByTime(30_000);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  // ─── sendVerificationMail ────────────────────────────────────────────────────

  it('should call authService.sendVerificationMail when resend is clicked', () => {
    vi.advanceTimersByTime(30_000); // let the cooldown finish so the button is enabled
    component.sendVerificationMail();
    expect(authService.sendVerificationMail).toHaveBeenCalled();
  });

  it('should restart the cooldown when resend is clicked', () => {
    vi.advanceTimersByTime(30_000);
    expect(component.isResendDisabled()).toBe(false);

    component.sendVerificationMail();

    expect(component.isResendDisabled()).toBe(true);
    expect(component.resendButtonText()).toBe('Resend Verification E-Mail (30)');
  });

  it('should not stack intervals when resend is clicked mid-cooldown', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    component.sendVerificationMail();
    expect(clearIntervalSpy).toHaveBeenCalled();

    vi.advanceTimersByTime(30_000);
    expect(component.resendButtonText()).toBe('Resend Verification E-Mail');
  });

  // ─── proceedToCheckout – success path ────────────────────────────────────────

  it('should call reloadUser and isLoggedIn, then redirect on success', async () => {
    await component.proceedToCheckout();

    expect(authService.reloadUser).toHaveBeenCalled();
    expect(authService.isLoggedIn).toHaveBeenCalledWith(true);
    expect(returnUrlService.openReturnURL).toHaveBeenCalledWith('/');
    expect(snackBarService.error).not.toHaveBeenCalled();
  });

  it('should reset isProceedToCheckoutLoading to false after success', async () => {
    await component.proceedToCheckout();
    expect(component.isProceedToCheckoutLoading()).toBe(false);
  });

  it('should set isProceedToCheckoutLoading to true while the request is in flight', async () => {
    let resolveReload!: () => void;
    authService.reloadUser.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveReload = resolve;
      }),
    );

    const checkoutPromise = component.proceedToCheckout();
    // isProceedToCheckoutLoading.set(true) runs synchronously before the
    // first await inside proceedToCheckout(), so a microtask flush is enough
    // to observe it — avoids whenStable(), which can hang under fake timers.
    await Promise.resolve();
    expect(component.isProceedToCheckoutLoading()).toBe(true);

    resolveReload();
    await checkoutPromise;

    expect(component.isProceedToCheckoutLoading()).toBe(false);
  });

  // ─── proceedToCheckout – failure path ────────────────────────────────────────

  it('should show an error snackbar and not redirect when not logged in/verified', async () => {
    authService.isLoggedIn.mockResolvedValue(false);

    await component.proceedToCheckout();

    expect(snackBarService.error).toHaveBeenCalledWith('Please verify your E-Mail address first.');
    expect(returnUrlService.openReturnURL).not.toHaveBeenCalled();
  });

  it('should reset isProceedToCheckoutLoading to false even when verification fails', async () => {
    authService.isLoggedIn.mockResolvedValue(false);

    await component.proceedToCheckout();

    expect(component.isProceedToCheckoutLoading()).toBe(false);
  });

  it('should reset isProceedToCheckoutLoading to false if reloadUser throws', async () => {
    authService.reloadUser.mockRejectedValueOnce(new Error('reload failed'));

    await expect(component.proceedToCheckout()).rejects.toThrow('reload failed');

    expect(component.isProceedToCheckoutLoading()).toBe(false);
  });

  // ─── ngOnDestroy ──────────────────────────────────────────────────────────────

  it('should clear the cooldown interval on destroy', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    fixture.destroy();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('should not throw when destroyed after the cooldown already completed', () => {
    vi.advanceTimersByTime(30_000);
    expect(() => fixture.destroy()).not.toThrow();
  });
});