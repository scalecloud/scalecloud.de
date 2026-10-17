import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { environment } from '../../../environments/environment';
import { Log } from '../logging/log';
import { Auth } from './auth';

const PENDING_RETURN_KEY = 'scalecloud.auth.pendingReturn';

describe('Auth', () => {
  let auth: Auth;
  let authenticatedState: ReturnType<typeof signal<{ isAuthenticated: boolean }>>;
  let userDataState: ReturnType<typeof signal<{ userData: unknown }>>;

  const router = {
    url: '/dashboard',
    navigate: vi.fn(),
    navigateByUrl: vi.fn(),
  };
  const log = {
    error: vi.fn(),
    warn: vi.fn(),
  };
  const oidc = {
    authenticated: vi.fn(() => authenticatedState()),
    userData: vi.fn(() => userDataState()),
    checkAuth: vi.fn(),
    getRefreshToken: vi.fn(),
    forceRefreshSession: vi.fn(),
    authorize: vi.fn(),
    logoffAndRevokeTokens: vi.fn(),
    logoff: vi.fn(),
    logoffLocal: vi.fn(),
  };

  function storePendingTarget(url: string, at = Date.now()): void {
    localStorage.setItem(PENDING_RETURN_KEY, JSON.stringify({ url, at }));
  }

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    authenticatedState = signal({ isAuthenticated: false });
    userDataState = signal({ userData: null });
    router.url = '/dashboard';
    oidc.checkAuth.mockReturnValue(of({ isAuthenticated: false }));
    oidc.getRefreshToken.mockReturnValue(of(null));
    oidc.forceRefreshSession.mockReturnValue(of({ isAuthenticated: false }));
    oidc.logoffAndRevokeTokens.mockReturnValue(of({}));
    oidc.logoff.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: oidc },
        { provide: Router, useValue: router },
        { provide: Log, useValue: log },
      ],
    });
    auth = TestBed.inject(Auth);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
    window.history.replaceState({}, '', '/');
  });

  describe('ensureAuthenticated', () => {
    it('returns true when the initial auth check is already authenticated', async () => {
      oidc.checkAuth.mockReturnValue(of({ isAuthenticated: true }));
      authenticatedState.set({ isAuthenticated: true });

      await expect(auth.ensureAuthenticated()).resolves.toBe(true);
      expect(oidc.forceRefreshSession).not.toHaveBeenCalled();
    });

    it('returns true when refreshing the session succeeds', async () => {
      oidc.getRefreshToken.mockReturnValue(of('refresh-token'));
      oidc.forceRefreshSession.mockImplementation(() => {
        authenticatedState.set({ isAuthenticated: true });
        return of({ isAuthenticated: true });
      });

      await expect(auth.ensureAuthenticated()).resolves.toBe(true);
      expect(oidc.forceRefreshSession).toHaveBeenCalled();
    });

    it('returns false when there is no refresh token', async () => {
      await expect(auth.ensureAuthenticated()).resolves.toBe(false);
      expect(oidc.forceRefreshSession).not.toHaveBeenCalled();
    });

    it('returns false when refreshing the session fails', async () => {
      oidc.getRefreshToken.mockReturnValue(of('refresh-token'));
      oidc.forceRefreshSession.mockReturnValue(throwError(() => new Error('refresh failed')));

      await expect(auth.ensureAuthenticated()).resolves.toBe(false);
      expect(log.warn).toHaveBeenCalledWith('Token refresh failed: refresh failed');
    });
  });

  it('login stores a safe return target and starts OIDC authorization', () => {
    auth.login('/dashboard/reports');

    expect(JSON.parse(localStorage.getItem(PENDING_RETURN_KEY) ?? '{}')).toMatchObject({
      url: '/dashboard/reports',
    });
    expect(oidc.authorize).toHaveBeenCalledOnce();
  });

  it('register stores its return target and redirects to the configured signup URL', () => {
    const assign = vi.spyOn(window.location, 'assign').mockImplementation(() => {});

    auth.register('/dashboard/reports');

    expect(JSON.parse(localStorage.getItem(PENDING_RETURN_KEY) ?? '{}')).toMatchObject({
      url: '/dashboard/reports',
    });
    expect(assign).toHaveBeenCalledWith(environment.oidc.signupUrl);
  });

  describe('resolveReturnTarget', () => {
    it('accepts a safe internal path', () => {
      expect(auth.resolveReturnTarget('/dashboard/reports')).toBe('/dashboard/reports');
    });

    it.each(['//x', '/\\x', 'https://example.com/path', '/login', '/register']) (
      'rejects unsafe or auth-flow path %s', (url) => {
        expect(auth.resolveReturnTarget(url)).toBe('/dashboard');
      },
    );

    it('falls back to a fresh pending target', () => {
      storePendingTarget('/dashboard/saved');

      expect(auth.resolveReturnTarget('/login')).toBe('/dashboard/saved');
    });

    it('ignores a pending target older than two hours', () => {
      storePendingTarget('/dashboard/expired', Date.now() - 2 * 60 * 60 * 1000 - 1);

      expect(auth.resolveReturnTarget()).toBe('/dashboard');
    });

    it('falls back to the dashboard when there is no safe target', () => {
      expect(auth.resolveReturnTarget()).toBe('/dashboard');
    });
  });

  it('handles an authenticated login callback, navigates to its target, and clears it', async () => {
    window.history.replaceState({}, '', '/?code=auth-code&state=state-value');
    oidc.checkAuth.mockReturnValue(of({ isAuthenticated: true }));
    authenticatedState.set({ isAuthenticated: true });
    storePendingTarget('/dashboard/after-login');

    await auth.init();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard/after-login', { replaceUrl: true });
    expect(localStorage.getItem(PENDING_RETURN_KEY)).toBeNull();
  });

  describe('showAsLoggedIn', () => {
    it('returns false until auth resolves, then reflects an authenticated session', async () => {
      oidc.checkAuth.mockReturnValue(of({ isAuthenticated: true }));
      authenticatedState.set({ isAuthenticated: true });

      expect(auth.resolved()).toBe(false);
      expect(auth.showAsLoggedIn()).toBe(false);

      await auth.init();

      expect(auth.resolved()).toBe(true);
      expect(auth.showAsLoggedIn()).toBe(true);
    });

    it('returns false after auth resolves for a signed-out user', async () => {
      await auth.init();

      expect(auth.resolved()).toBe(true);
      expect(auth.showAsLoggedIn()).toBe(false);
    });
  });

  it('logout clears local auth state and starts OIDC logout', () => {
    storePendingTarget('/dashboard/after-login');

    auth.logout();

    expect(oidc.logoffAndRevokeTokens).toHaveBeenCalledOnce();
    expect(localStorage.getItem(PENDING_RETURN_KEY)).toBeNull();
  });
});