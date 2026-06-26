import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { ForgotPasswordGuard } from './forgot-password.guard';
import { AuthService } from '../services/auth.service';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

describe('ForgotPasswordGuard', () => {
  let guard: ForgotPasswordGuard;
  const routerMock = { navigate: vi.fn() };
  const ngZoneMock = { run: vi.fn((fn: () => void) => fn()) };
  const authServiceMock = {
    isLoggedIn: vi.fn().mockResolvedValue(false),
    isLoggedInNotVerified: vi.fn().mockResolvedValue(false)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ForgotPasswordGuard,
        { provide: Router, useValue: routerMock },
        { provide: NgZone, useValue: ngZoneMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    guard = TestBed.inject(ForgotPasswordGuard);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is not authenticated', async () => {
    authServiceMock.isLoggedIn.mockResolvedValue(false);
    authServiceMock.isLoggedInNotVerified.mockResolvedValue(false);

    const result = await guard.canActivate({} as any, {} as any);

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to dashboard when user is logged in', async () => {
    authServiceMock.isLoggedIn.mockResolvedValue(true);
    authServiceMock.isLoggedInNotVerified.mockResolvedValue(false);

    const result = await guard.canActivate({} as any, {} as any);

    expect(result).toBe(false);
    expect(ngZoneMock.run).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to verify email when user is logged in but not verified', async () => {
    authServiceMock.isLoggedIn.mockResolvedValue(false);
    authServiceMock.isLoggedInNotVerified.mockResolvedValue(true);

    const result = await guard.canActivate({} as any, {} as any);

    expect(result).toBe(false);
    expect(ngZoneMock.run).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/verify-email-address']);
  });
});
