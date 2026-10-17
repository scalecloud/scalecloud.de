import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loginGuard } from './login-guard';
import { Auth } from '../auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRoute(params: Record<string, string> = {}): ActivatedRouteSnapshot {
  return { queryParamMap: convertToParamMap(params) } as ActivatedRouteSnapshot;
}

function makeState(url = '/login'): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('loginGuard', () => {
  let router: Router;

  const auth = {
    ensureAuthenticated: vi.fn(),
    login: vi.fn(),
    resolveReturnTarget: vi.fn(),
  };

  function run(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return TestBed.runInInjectionContext(() => loginGuard(route, state));
  }

  beforeEach(() => {
    vi.clearAllMocks();
    // Same contract as the real Auth: a given URL wins, otherwise the dashboard.
    auth.resolveReturnTarget.mockImplementation((url?: string | null) => url ?? '/dashboard');

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Auth, useValue: auth }],
    });
    router = TestBed.inject(Router);
  });

  // ─── Signed in ──────────────────────────────────────────────────────────────

  describe('when the user is signed in', () => {
    beforeEach(() => {
      auth.ensureAuthenticated.mockResolvedValue(true);
    });

    it('redirects to the dashboard when there is no returnUrl', async () => {
      const result = await run(makeRoute(), makeState());

      expect(result).toBeInstanceOf(UrlTree);
      expect(router.serializeUrl(result as UrlTree)).toBe('/dashboard');
    });

    it('redirects to the returnUrl', async () => {
      const result = await run(makeRoute({ returnUrl: '/checkout?plan=pro' }), makeState());

      expect(router.serializeUrl(result as UrlTree)).toBe('/checkout?plan=pro');
    });

    it('does not start the Authentik login', async () => {
      await run(makeRoute(), makeState());

      expect(auth.login).not.toHaveBeenCalled();
    });
  });

  // ─── Signed out ─────────────────────────────────────────────────────────────

  describe('when the user is signed out', () => {
    beforeEach(() => {
      auth.ensureAuthenticated.mockResolvedValue(false);
    });

    it('starts the Authentik login with the resolved target and blocks the navigation', async () => {
      const result = await run(makeRoute({ returnUrl: '/checkout?plan=pro' }), makeState());

      expect(auth.login).toHaveBeenCalledWith('/checkout?plan=pro');
      expect(result).toBe(false);
    });

    it('uses the resolved fallback target when there is no returnUrl', async () => {
      await run(makeRoute(), makeState());

      expect(auth.login).toHaveBeenCalledWith('/dashboard');
    });

    it('never uses its own URL (/login) as the return target', async () => {
      await run(makeRoute({ returnUrl: '/checkout?plan=pro' }), makeState('/login?returnUrl=%2Fcheckout%3Fplan%3Dpro'));

      expect(auth.login).not.toHaveBeenCalledWith(expect.stringContaining('/login'));
    });
  });

  // ─── Return target ──────────────────────────────────────────────────────────

  it('asks Auth to resolve the returnUrl query parameter', async () => {
    auth.ensureAuthenticated.mockResolvedValue(false);

    await run(makeRoute({ returnUrl: '/dashboard/subscription/42' }), makeState());

    expect(auth.resolveReturnTarget).toHaveBeenCalledWith('/dashboard/subscription/42');
  });

  it('passes null to Auth when the returnUrl query parameter is missing', async () => {
    auth.ensureAuthenticated.mockResolvedValue(false);

    await run(makeRoute(), makeState());

    expect(auth.resolveReturnTarget).toHaveBeenCalledWith(null);
  });
});