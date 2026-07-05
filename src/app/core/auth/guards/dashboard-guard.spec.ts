import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { dashboardGuard } from './dashboard-guard';
import { Auth } from '../auth';

const mockRouter = { navigate: vi.fn() };
const mockAuth = {
  isLoggedIn: vi.fn(),
  isLoggedInNotVerified: vi.fn(),
};

const MOCK_URL = '/dashboard/overview';

function runGuard(url = MOCK_URL): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    dashboardGuard({} as any, { url } as any) as Promise<boolean>
  );
}

describe('dashboardGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: mockAuth },
      ],
    });
  });

  describe('when the user is logged in but unverified', () => {
    beforeEach(() => {
      mockAuth.isLoggedInNotVerified.mockResolvedValue(true);
      mockAuth.isLoggedIn.mockResolvedValue(false);
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
      expect(mockAuth.isLoggedIn).not.toHaveBeenCalled();
    });
  });

  describe('when the user is not logged in at all', () => {
    beforeEach(() => {
      mockAuth.isLoggedInNotVerified.mockResolvedValue(false);
      mockAuth.isLoggedIn.mockResolvedValue(false);
    });

    it('redirects to /login', async () => {
      await runGuard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/login'],
        { queryParams: { returnUrl: MOCK_URL } }
      );
    });

    it('passes the attempted URL as a returnUrl query param', async () => {
      await runGuard('/dashboard/settings');
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/login'],
        { queryParams: { returnUrl: '/dashboard/settings' } }
      );
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });
  });

  describe('when the user is fully logged in and verified', () => {
    beforeEach(() => {
      mockAuth.isLoggedInNotVerified.mockResolvedValue(false);
      mockAuth.isLoggedIn.mockResolvedValue(true);
    });

    it('allows activation', async () => {
      expect(await runGuard()).toBe(true);
    });

    it('does not redirect anywhere', async () => {
      await runGuard();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});