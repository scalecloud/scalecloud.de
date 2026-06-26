import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { checkoutGuard } from './checkout.guard';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log/log.service';

const mockRouter = { navigate: vi.fn() };
const mockAuthService = {
  isLoggedIn: vi.fn(),
  isLoggedInNotVerified: vi.fn(),
};
const mockLogService = { log: vi.fn() };

const MOCK_URL = '/checkout/summary';

function runGuard(url = MOCK_URL): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    checkoutGuard({} as any, { url } as any) as Promise<boolean>
  );
}

describe('checkoutGuard', () => {
  let ngZone: NgZone;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: LogService, useValue: mockLogService },
      ],
    });

    ngZone = TestBed.inject(NgZone);
    vi.spyOn(ngZone, 'run').mockImplementation((fn: () => unknown) => fn());
  });

  describe('when the user is logged in but unverified', () => {
    beforeEach(() => {
      mockAuthService.isLoggedInNotVerified.mockResolvedValue(true);
      mockAuthService.isLoggedIn.mockResolvedValue(false);
    });

    it('redirects to /verify-email-address', async () => {
      await runGuard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/verify-email-address']);
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });

    it('does not check isLoggedIn when already determined to be unverified', async () => {
      await runGuard();
      expect(mockAuthService.isLoggedIn).not.toHaveBeenCalled();
    });

    it('does not log when redirecting unverified users', async () => {
      await runGuard();
      expect(mockLogService.log).not.toHaveBeenCalled();
    });
  });

  describe('when the user is not logged in at all', () => {
    beforeEach(() => {
      mockAuthService.isLoggedInNotVerified.mockResolvedValue(false);
      mockAuthService.isLoggedIn.mockResolvedValue(false);
    });

    it('redirects to /register', async () => {
      await runGuard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/register'],
        { queryParams: { returnUrl: MOCK_URL } }
      );
    });

    it('passes the attempted URL as a returnUrl query param', async () => {
      await runGuard('/checkout/payment');
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/register'],
        { queryParams: { returnUrl: '/checkout/payment' } }
      );
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });

    it('logs before redirecting unauthenticated users', async () => {
      await runGuard();
      expect(mockLogService.log).toHaveBeenCalledWith(
        'CheckoutGuard: canActivate: User is not logged in. Redirecting to login page.'
      );
    });
  });

  describe('when the user is fully logged in and verified', () => {
    beforeEach(() => {
      mockAuthService.isLoggedInNotVerified.mockResolvedValue(false);
      mockAuthService.isLoggedIn.mockResolvedValue(true);
    });

    it('allows activation', async () => {
      expect(await runGuard()).toBe(true);
    });

    it('does not redirect anywhere', async () => {
      await runGuard();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('does not log anything for authenticated users', async () => {
      await runGuard();
      expect(mockLogService.log).not.toHaveBeenCalled();
    });
  });
});