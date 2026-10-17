import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Log } from '../logging/log';

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  claims: Record<string, unknown>;
}

const PENDING_RETURN_KEY = 'scalecloud.auth.pendingReturn';
const DEFAULT_RETURN_TARGET = '/dashboard';

const PENDING_RETURN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly oidc = inject(OidcSecurityService);
  private readonly router = inject(Router);
  private readonly log = inject(Log);

  private readonly resolvedSignal = signal(false);
  private initPromise: Promise<void> | null = null;

  readonly resolved: Signal<boolean> = this.resolvedSignal.asReadonly();

  readonly isAuthenticated: Signal<boolean> = computed(
    () => this.resolvedSignal() && this.oidc.authenticated().isAuthenticated,
  );

  readonly user: Signal<AuthUser | null> = computed(() =>
    this.isAuthenticated() ? toUser(this.oidc.userData().userData) : null,
  );

  readonly showAsLoggedIn: Signal<boolean> = computed(() =>
    this.resolvedSignal() && this.isAuthenticated(),
  );

  init(): Promise<void> {
    this.initPromise ??= this.runInitialCheck();
    return this.initPromise;
  }

  private async runInitialCheck(): Promise<void> {
    const isLoginCallback = new URLSearchParams(window.location.search).has('code');
    let redirectTo: string | null = null;

    try {
      const { isAuthenticated } = await firstValueFrom(this.oidc.checkAuth());

      if (!isAuthenticated && !isLoginCallback) {
        await this.tryRefresh();
      }
      if (isLoginCallback) {
        redirectTo = this.takeReturnTarget(isAuthenticated);
      }
    } catch (error) {
      this.log.error('Initial auth check failed: ' + (error as Error).message);
    }

    this.resolvedSignal.set(true);

    if (redirectTo) {
      void this.router.navigateByUrl(redirectTo, { replaceUrl: true });
    }
  }

  async ensureAuthenticated(): Promise<boolean> {
    await this.init();
    return this.isAuthenticated() || (await this.tryRefresh());
  }

  private async tryRefresh(): Promise<boolean> {
    try {
      const refreshToken = await firstValueFrom(this.oidc.getRefreshToken());
      if (!refreshToken) {
        return false;
      }
      const { isAuthenticated } = await firstValueFrom(this.oidc.forceRefreshSession());
      return isAuthenticated;
    } catch (error) {
      this.log.warn('Token refresh failed: ' + (error as Error).message);
      return false;
    }
  }

  login(returnTo?: string): void {
    writePendingReturn(this.resolveReturnTarget(returnTo ?? this.router.url));
    this.oidc.authorize();
  }

  register(returnTo?: string): void {
    writePendingReturn(this.resolveReturnTarget(returnTo));
    window.location.assign(environment.oidc.signupUrl);
  }

  logout(): void {
    clearPendingReturn();
    this.oidc
      .logoffAndRevokeTokens()
      .pipe(catchError(() => this.oidc.logoff()))
      .subscribe({
        error: (error: unknown) => {
          this.log.error('Logout failed: ' + (error as Error).message);
          this.oidc.logoffLocal();
          void this.router.navigate(['/']);
        },
      });
  }

  resolveReturnTarget(url?: string | null): string {
    if (url && isReturnable(url)) {
      return url;
    }
    return readPendingReturn() ?? DEFAULT_RETURN_TARGET;
  }

  private takeReturnTarget(isAuthenticated: boolean): string {
    const stored = readPendingReturn();
    clearPendingReturn();
    return isAuthenticated ? this.resolveReturnTarget(stored) : '/';
  }
}

function toUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const claims = raw as Record<string, unknown>;
  const sub = claims['sub'];
  if (typeof sub !== 'string') {
    return null;
  }
  return {
    uid: sub,
    email: asString(claims['email']),
    emailVerified: claims['email_verified'] === true,
    displayName: asString(claims['name']) ?? asString(claims['preferred_username']),
    claims,
  };
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function isSafeInternalUrl(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\');
}

/** Safe internal path that is not one of the routes that start an auth flow themselves. */
function isReturnable(url: string): boolean {
  return isSafeInternalUrl(url) && !/^\/(login|register)([/?#]|$)/.test(url);
}

function readPendingReturn(): string | null {
  try {
    const raw = localStorage.getItem(PENDING_RETURN_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { url?: unknown; at?: unknown };
    const fresh = typeof parsed.at === 'number' && Date.now() - parsed.at < PENDING_RETURN_MAX_AGE_MS;
    return fresh && typeof parsed.url === 'string' && isReturnable(parsed.url) ? parsed.url : null;
  } catch {
    return null;
  }
}

function writePendingReturn(url: string): void {
  try {
    localStorage.setItem(PENDING_RETURN_KEY, JSON.stringify({ url, at: Date.now() }));
  } catch {
    // ignore: without it the user lands on the dashboard after login
  }
}

function clearPendingReturn(): void {
  try {
    localStorage.removeItem(PENDING_RETURN_KEY);
  } catch {
    // ignore
  }
}