import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, convertToParamMap } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { registerGuard } from './register-guard';
import { Auth } from '../auth';

const urlTree = {} as UrlTree;
const mockRouter = { parseUrl: vi.fn() };
const mockAuth = {
  ensureAuthenticated: vi.fn(),
  register: vi.fn(),
  resolveReturnTarget: vi.fn(),
};

function runGuard(returnUrl?: string): Promise<boolean | UrlTree> {
  const route = { queryParamMap: convertToParamMap(returnUrl ? { returnUrl } : {}) };
  return TestBed.runInInjectionContext(() =>
    registerGuard(route as any, {} as any) as Promise<boolean | UrlTree>
  );
}

describe('registerGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.parseUrl.mockReturnValue(urlTree);
    // Same contract as Auth.resolveReturnTarget: fall back to the dashboard.
    mockAuth.resolveReturnTarget.mockImplementation((url?: string | null) => url ?? '/dashboard');

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: mockAuth },
      ],
    });
  });

  describe('when the user already has a valid session', () => {
    beforeEach(() => {
      mockAuth.ensureAuthenticated.mockResolvedValue(true);
    });

    it('redirects to the returnUrl', async () => {
      const result = await runGuard('/checkout?plan=nextcloud-yearly');
      expect(mockRouter.parseUrl).toHaveBeenCalledWith('/checkout?plan=nextcloud-yearly');
      expect(result).toBe(urlTree);
    });

    it('redirects to /dashboard when there is no returnUrl', async () => {
      await runGuard();
      expect(mockRouter.parseUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('does not start the registration', async () => {
      await runGuard();
      expect(mockAuth.register).not.toHaveBeenCalled();
    });
  });

  describe('when the user has no valid session', () => {
    beforeEach(() => {
      mockAuth.ensureAuthenticated.mockResolvedValue(false);
    });

    it('sends the user to the Authentik enrollment flow with the returnUrl as target', async () => {
      await runGuard('/checkout?plan=nextcloud-yearly');
      expect(mockAuth.register).toHaveBeenCalledWith('/checkout?plan=nextcloud-yearly');
    });

    it('uses /dashboard as target when there is no returnUrl', async () => {
      await runGuard();
      expect(mockAuth.register).toHaveBeenCalledWith('/dashboard');
    });

    it('blocks activation and does not redirect inside the app', async () => {
      expect(await runGuard()).toBe(false);
      expect(mockRouter.parseUrl).not.toHaveBeenCalled();
    });
  });
});