import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { ForgotPasswordComponent } from './forgot-password.component';
import { Auth } from 'src/app/core/auth/auth';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authMock: { forgotPassword: ReturnType<typeof vi.fn> };
  let snackBar: { error: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authMock = { forgotPassword: vi.fn().mockResolvedValue(false) };
    snackBar = { error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: authMock },
        { provide: SnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  it('should initialise with an empty email field', () => {
    expect(component.email.value).toBe('');
  });

  it('should initialise as not clicked, with the default button text', () => {
    expect(component.clicked()).toBe(false);
    expect(component.buttonText()).toBe('Reset Password');
  });

  // ─── Email validation ────────────────────────────────────────────────────────

  it('should return required error message when email is empty', () => {
    component.email.setValue('');
    expect(component.getErrorMessageEMail()).toBe('You must enter your E-Mail address');
  });

  it('should return format error message for an invalid email', () => {
    component.email.setValue('not-an-email');
    expect(component.getErrorMessageEMail()).toBe('Not a valid E-Mail address');
  });

  it('should return an empty string when the email is valid', () => {
    component.email.setValue('valid@example.com');
    expect(component.getErrorMessageEMail()).toBe('');
  });

  it('should report invalid for an empty email', () => {
    component.email.setValue('');
    expect(component.isEmailInvalid()).toBe(true);
  });

  it('should report invalid for a malformed email', () => {
    component.email.setValue('not-an-email');
    expect(component.isEmailInvalid()).toBe(true);
  });

  it('should report valid for a well-formed email', () => {
    component.email.setValue('valid@example.com');
    expect(component.isEmailInvalid()).toBe(false);
  });

  // ─── forgotPassword – invalid email path ──────────────────────────────────────

  it('should show a snackbar error and not call Auth when the email is invalid', async () => {
    component.email.setValue('not-an-email');

    await component.forgotPassword();

    expect(snackBar.error).toHaveBeenCalledWith('Please enter a valid E-Mail address');
    expect(authMock.forgotPassword).not.toHaveBeenCalled();
  });

  it('should mark the email as touched when submitting with an invalid email', async () => {
    component.email.setValue('');

    await component.forgotPassword();

    expect(component.email.touched).toBe(true);
  });

  it('should not start the countdown when the email is invalid', async () => {
    component.email.setValue('not-an-email');

    await component.forgotPassword();

    expect(component.clicked()).toBe(false);
  });

  // ─── forgotPassword – valid email path ────────────────────────────────────────

  it('should call Auth.forgotPassword with the email value', async () => {
    component.email.setValue('user@example.com');

    await component.forgotPassword();

    expect(authMock.forgotPassword).toHaveBeenCalledWith('user@example.com');
  });

  it('should not show a snackbar error when the email is valid', async () => {
    component.email.setValue('user@example.com');

    await component.forgotPassword();

    expect(snackBar.error).not.toHaveBeenCalled();
  });

  it('should not start the countdown when Auth resolves false', async () => {
    authMock.forgotPassword.mockResolvedValue(false);
    component.email.setValue('user@example.com');

    await component.forgotPassword();

    expect(component.clicked()).toBe(false);
  });

  // ─── Countdown behavior ────────────────────────────────────────────────────────

  describe('with fake timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should disable the button and show the full countdown immediately after a successful request', async () => {
      authMock.forgotPassword.mockResolvedValue(true);
      component.email.setValue('user@example.com');

      await component.forgotPassword();

      expect(component.clicked()).toBe(true);
      expect(component.buttonText()).toBe('Reset Password (60)');
    });

    it('should count down by one each second', async () => {
      authMock.forgotPassword.mockResolvedValue(true);
      component.email.setValue('user@example.com');

      await component.forgotPassword();

      await vi.advanceTimersByTimeAsync(1000);
      expect(component.buttonText()).toBe('Reset Password (59)');

      await vi.advanceTimersByTimeAsync(1000);
      expect(component.buttonText()).toBe('Reset Password (58)');
    });

    it('should re-enable the button and reset the text once the countdown completes', async () => {
      authMock.forgotPassword.mockResolvedValue(true);
      component.email.setValue('user@example.com');

      await component.forgotPassword();
      await vi.advanceTimersByTimeAsync(60_000);

      expect(component.clicked()).toBe(false);
      expect(component.buttonText()).toBe('Reset Password');
    });

    it('should not go below zero if more time passes after completion', async () => {
      authMock.forgotPassword.mockResolvedValue(true);
      component.email.setValue('user@example.com');

      await component.forgotPassword();
      await vi.advanceTimersByTimeAsync(120_000);

      expect(component.clicked()).toBe(false);
      expect(component.buttonText()).toBe('Reset Password');
    });

    it('should allow a fresh request and a fresh countdown after the previous one completes', async () => {
      authMock.forgotPassword.mockResolvedValue(true);
      component.email.setValue('user@example.com');

      await component.forgotPassword();
      await vi.advanceTimersByTimeAsync(60_000);
      expect(component.clicked()).toBe(false);

      await component.forgotPassword();
      expect(component.clicked()).toBe(true);
      expect(component.buttonText()).toBe('Reset Password (60)');
    });
  });

  // ─── DOM ─────────────────────────────────────────────────────────────────────

  it('should disable the submit button in the DOM while the countdown is active', async () => {
    authMock.forgotPassword.mockResolvedValue(true);
    component.email.setValue('user@example.com');

    await component.forgotPassword();
    await fixture.whenStable();

    const submitButton = fixture.nativeElement.querySelector('button[color="primary"]') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });
});