import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { LoginComponent } from './login.component';
import { LogService } from 'src/app/core/logging/log.service';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';
import { Auth } from 'src/app/core/auth/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authMock: { login: ReturnType<typeof vi.fn> };
  let logService: { warn: ReturnType<typeof vi.fn> };
  let returnUrlService: { openUrlKeepReturnUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authMock = { login: vi.fn() };
    logService = { warn: vi.fn() };
    returnUrlService = { openUrlKeepReturnUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: authMock },
        { provide: LogService, useValue: logService },
        { provide: ReturnUrlService, useValue: returnUrlService },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show validation errors before the user submits', () => {
    expect(component.emailInvalid()).toBe(false);
    expect(component.passwordInvalid()).toBe(false);

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBe(0);
  });

  it('should call Auth.login with the form values on valid submit', async () => {
    component.email.setValue('user@example.com');
    component.password.setValue('correct-password');

    component.login();
    await fixture.whenStable();

    expect(authMock.login).toHaveBeenCalledWith('user@example.com', 'correct-password');
    expect(logService.warn).not.toHaveBeenCalled();
  });

  it('should warn and not call login when the email is empty', async () => {
    component.email.setValue('');
    component.password.setValue('correct-password');

    component.login();
    await fixture.whenStable();

    expect(logService.warn).toHaveBeenCalledWith('Invalid inputs in Login.');
    expect(authMock.login).not.toHaveBeenCalled();
  });

  it('should warn and not call login when the email is malformed', async () => {
    component.email.setValue('not-an-email');
    component.password.setValue('correct-password');

    component.login();
    await fixture.whenStable();

    expect(logService.warn).toHaveBeenCalledWith('Invalid inputs in Login.');
    expect(authMock.login).not.toHaveBeenCalled();
  });

  it('should warn and not call login when the password is empty', async () => {
    component.email.setValue('user@example.com');
    component.password.setValue('');

    component.login();
    await fixture.whenStable();

    expect(logService.warn).toHaveBeenCalledWith('Invalid inputs in Login.');
    expect(authMock.login).not.toHaveBeenCalled();
  });

  it('should show the required email error message after an invalid submit', async () => {
    component.email.setValue('');
    component.password.setValue('correct-password');

    component.login();
    await fixture.whenStable();

    expect(component.emailErrorMessage()).toBe('You must enter your E-Mail address');
  });

  it('should show the invalid-format email error message after an invalid submit', async () => {
    component.email.setValue('not-an-email');
    component.password.setValue('correct-password');

    component.login();
    await fixture.whenStable();

    expect(component.emailErrorMessage()).toBe('Not a valid E-Mail address');
  });

  it('should show the required password error message after an invalid submit', async () => {
    component.email.setValue('user@example.com');
    component.password.setValue('');

    component.login();
    await fixture.whenStable();

    expect(component.passwordErrorMessage()).toBe('You must enter your password');
  });

  it('should render mat-error elements in the DOM after an invalid submit', async () => {
    component.email.setValue('');
    component.password.setValue('');

    component.login();
    await fixture.whenStable();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBe(2);
  });

  it('should call ReturnUrlService.openUrlKeepReturnUrl with /register when Register is clicked', () => {
    component.openUrlKeepReturnUrl();

    expect(returnUrlService.openUrlKeepReturnUrl).toHaveBeenCalledWith('/register');
  });

  it('should trigger login() when the Login button is clicked', async () => {
    const loginSpy = vi.spyOn(component, 'login');
    component.email.setValue('user@example.com');
    component.password.setValue('correct-password');
    await fixture.whenStable();

    const loginButton = fixture.debugElement.queryAll(By.css('button'))
      .find((btn) => btn.nativeElement.textContent.trim() === 'Login');
    loginButton?.nativeElement.click();
    await fixture.whenStable();

    expect(loginSpy).toHaveBeenCalled();
  });

  it('should trigger openUrlKeepReturnUrl() when the Register button is clicked', async () => {
    const registerSpy = vi.spyOn(component, 'openUrlKeepReturnUrl');

    const registerButton = fixture.debugElement.queryAll(By.css('button'))
      .find((btn) => btn.nativeElement.textContent.trim() === 'Register');
    registerButton?.nativeElement.click();
    await fixture.whenStable();

    expect(registerSpy).toHaveBeenCalled();
  });
});