import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { Register } from './register';
import { Auth } from 'src/app/core/auth/auth';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

// A password that satisfies every PasswordStrengthComponent check.
const STRONG_PASSWORD = 'Abcdefg1!';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authMock: { register: ReturnType<typeof vi.fn> };
  let returnUrl: { openUrlKeepReturnUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authMock = { register: vi.fn() };
    returnUrl = { openUrlKeepReturnUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: ReturnUrl, useValue: returnUrl },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function fillValidForm(): void {
    component.form.controls.email.setValue('user@example.com');
    component.form.controls.password.setValue(STRONG_PASSWORD);
    component.form.controls.confirmPassword.setValue(STRONG_PASSWORD);
    component.form.controls.acceptTerms.setValue(true);
  }

  // ─── Creation & initial state ─────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with all fields empty/false', () => {
    expect(component.form.controls.email.value).toBe('');
    expect(component.form.controls.password.value).toBe('');
    expect(component.form.controls.confirmPassword.value).toBe('');
    expect(component.form.controls.acceptTerms.value).toBe(false);
  });

  it('should initialise as invalid', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should not show any errors before submission', () => {
    expect(component.emailErrors()).toBeNull();
    expect(component.passwordErrors()).toBeNull();
    expect(component.confirmPasswordErrors()).toBeNull();
    expect(component.acceptTermsErrors()).toBeNull();
  });

  it('should resolve passwordStrength and passwordMatch view children', () => {
    expect(component.passwordStrength()).toBeTruthy();
    expect(component.passwordMatch()).toBeTruthy();
  });

  // ─── Email validation ────────────────────────────────────────────────────────

  it('should show a required error for an empty email after submit', () => {
    fillValidForm();
    component.form.controls.email.setValue('');

    component.onSubmit();

    expect(component.emailErrors()?.['required']).toBeTruthy();
  });

  it('should show a format error for a malformed email after submit', () => {
    fillValidForm();
    component.form.controls.email.setValue('not-an-email');

    component.onSubmit();

    expect(component.emailErrors()?.['email']).toBeTruthy();
  });

  it('should show no email error for a valid email after submit', () => {
    fillValidForm();

    component.onSubmit();

    expect(component.emailErrors()).toBeNull();
  });

  // ─── Password validation ──────────────────────────────────────────────────────

  it('should show a required error for an empty password after submit', () => {
    fillValidForm();
    component.form.controls.password.setValue('');

    component.onSubmit();

    expect(component.passwordErrors()?.['required']).toBeTruthy();
  });

  it('should show a minlength error for a short password after submit', () => {
    fillValidForm();
    component.form.controls.password.setValue('Ab1!');
    component.form.controls.confirmPassword.setValue('Ab1!');

    component.onSubmit();

    expect(component.passwordErrors()?.['minlength']).toBeTruthy();
  });

  // ─── Confirm password / matching validator ────────────────────────────────────

  it('should set a matching error on confirmPassword when passwords differ', () => {
    fillValidForm();
    component.form.controls.confirmPassword.setValue('SomethingElse1!');

    component.onSubmit();

    expect(component.confirmPasswordErrors()?.['matching']).toBeTruthy();
  });

  it('should show a required error for an empty confirmPassword after submit', () => {
    fillValidForm();
    component.form.controls.confirmPassword.setValue('');

    component.onSubmit();

    expect(component.confirmPasswordErrors()?.['required']).toBeTruthy();
  });

  it('should clear the matching error once passwords match again', () => {
    component.form.controls.password.setValue(STRONG_PASSWORD);
    component.form.controls.confirmPassword.setValue('Different1!');
    expect(component.form.controls.confirmPassword.errors?.['matching']).toBeTruthy();

    component.form.controls.confirmPassword.setValue(STRONG_PASSWORD);
    expect(component.form.controls.confirmPassword.errors).toBeNull();
  });

  // ─── Accept terms ────────────────────────────────────────────────────────────

  it('should show an error when terms are not accepted after submit', () => {
    fillValidForm();
    component.form.controls.acceptTerms.setValue(false);

    component.onSubmit();

    expect(component.acceptTermsErrors()?.['required']).toBeTruthy();
  });

  it('should show no terms error once accepted', () => {
    fillValidForm();

    component.onSubmit();

    expect(component.acceptTermsErrors()).toBeNull();
  });

  // ─── onSubmit – success path ──────────────────────────────────────────────────

  it('should call Auth.register with email and password on a fully valid submit', async () => {
    fillValidForm();
    await fixture.whenStable();

    component.onSubmit();

    expect(authMock.register).toHaveBeenCalledWith('user@example.com', STRONG_PASSWORD);
  });

  it('should not call Auth.register when the form is invalid', () => {
    component.onSubmit();
    expect(authMock.register).not.toHaveBeenCalled();
  });

  it('should not call Auth.register when the password is not strong enough', async () => {
    component.form.controls.email.setValue('user@example.com');
    component.form.controls.password.setValue('weakweak');
    component.form.controls.confirmPassword.setValue('weakweak');
    component.form.controls.acceptTerms.setValue(true);
    await fixture.whenStable();

    component.onSubmit();

    expect(authMock.register).not.toHaveBeenCalled();
  });

  it('should not call Auth.register when passwords do not match', async () => {
    component.form.controls.email.setValue('user@example.com');
    component.form.controls.password.setValue(STRONG_PASSWORD);
    component.form.controls.confirmPassword.setValue('Different1!');
    component.form.controls.acceptTerms.setValue(true);
    await fixture.whenStable();

    component.onSubmit();

    expect(authMock.register).not.toHaveBeenCalled();
  });

  it('should mark the form as submitted on submit attempt', () => {
    component.onSubmit();
    expect(component.emailErrors()).not.toBeNull();
  });

  it('should mark all controls as touched on submit', () => {
    component.onSubmit();

    expect(component.form.controls.email.touched).toBe(true);
    expect(component.form.controls.password.touched).toBe(true);
    expect(component.form.controls.confirmPassword.touched).toBe(true);
    expect(component.form.controls.acceptTerms.touched).toBe(true);
  });

  // ─── onReset ──────────────────────────────────────────────────────────────────

  it('should clear submitted state and form values on reset', () => {
    fillValidForm();
    component.onSubmit();
    expect(component.emailErrors()).toBeNull();

    component.onReset();

    expect(component.form.controls.email.value).toBe('');
    expect(component.form.controls.password.value).toBe('');
    expect(component.form.controls.confirmPassword.value).toBe('');
    expect(component.form.controls.acceptTerms.value).toBe(false);
  });

  it('should hide errors again after a reset even if previously submitted', () => {
    component.onSubmit();
    expect(component.emailErrors()).not.toBeNull();

    component.onReset();

    expect(component.emailErrors()).toBeNull();
  });

  // ─── Error messages ──────────────────────────────────────────────────────────

  it('should expose the expected static error messages', () => {
    expect(component.getErrorMessageEMailRequired()).toBe('You must enter a value');
    expect(component.getErrorMessageEMailNotValid()).toBe('Not a valid email');
    expect(component.getErrorMessagePasswordRequired()).toBe('You must enter a value');
    expect(component.getErrorMessagePasswordMinLength()).toBe('Password must be at least 8 characters long');
    expect(component.getErrorMessagePasswordConfirmRequired()).toBe('Confirm Password is required');
    expect(component.getErrorMessagePasswordConfirmMatch()).toBe('Confirm Password does not match');
  });

  // ─── Navigation ──────────────────────────────────────────────────────────────

  it('should call ReturnUrlService.openUrlKeepReturnUrl with /login when Login is clicked', () => {
    component.openUrlKeepReturnUrl();
    expect(returnUrl.openUrlKeepReturnUrl).toHaveBeenCalledWith('/login');
  });
});