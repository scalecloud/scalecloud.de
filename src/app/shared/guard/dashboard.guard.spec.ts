import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { dashboardGuard } from './dashboard.guard';
import { AuthService } from '../services/auth.service';

const mockRouter = { navigate: vi.fn() };
const mockAuthService = {
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
  let ngZone: NgZone;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
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
  });

  describe('when the user is not logged in at all', () => {
    beforeEach(() => {
      mockAuthService.isLoggedInNotVerified.mockResolvedValue(false);
      mockAuthService.isLoggedIn.mockResolvedValue(false);
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
  });
});