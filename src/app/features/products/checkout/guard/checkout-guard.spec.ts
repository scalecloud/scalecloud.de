import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { checkoutGuard } from './checkout-guard';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';

const mockRouter = { navigate: vi.fn() };
const authMock = {
  isLoggedIn: vi.fn(),
  isLoggedInNotVerified: vi.fn(),
};
const mockLog = { log: vi.fn() };

const MOCK_URL = '/checkout/summary';

function runGuard(url = MOCK_URL): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    checkoutGuard({} as any, { url } as any) as Promise<boolean>
  );
}

describe('checkoutGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: authMock },
        { provide: Log, useValue: mockLog },
      ],
    });
  });

  describe('when the user is logged in but unverified', () => {
    beforeEach(() => {
      authMock.isLoggedInNotVerified.mockResolvedValue(true);
      authMock.isLoggedIn.mockResolvedValue(false);
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
      expect(authMock.isLoggedIn).not.toHaveBeenCalled();
    });

    it('does not log when redirecting unverified users', async () => {
      await runGuard();
      expect(mockLog.log).not.toHaveBeenCalled();
    });
  });

  describe('when the user is not logged in at all', () => {
    beforeEach(() => {
      authMock.isLoggedInNotVerified.mockResolvedValue(false);
      authMock.isLoggedIn.mockResolvedValue(false);
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
      expect(mockLog.log).toHaveBeenCalledWith(
        'CheckoutGuard: canActivate: User is not logged in. Redirecting to login page.'
      );
    });
  });

  describe('when the user is fully logged in and verified', () => {
    beforeEach(() => {
      authMock.isLoggedInNotVerified.mockResolvedValue(false);
      authMock.isLoggedIn.mockResolvedValue(true);
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
      expect(mockLog.log).not.toHaveBeenCalled();
    });
  });
});