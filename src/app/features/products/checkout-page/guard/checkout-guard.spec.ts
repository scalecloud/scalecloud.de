import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Auth } from 'src/app/core/auth/auth';
import { checkoutGuard } from './checkout-guard';

const authMock = {
  ensureAuthenticated: vi.fn(),
  login: vi.fn(),
};

const MOCK_URL = '/checkout/summary';

function runGuard(url = MOCK_URL): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    checkoutGuard(null!, { url } as RouterStateSnapshot) as Promise<boolean>
  );
}

describe('checkoutGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.ensureAuthenticated.mockResolvedValue(false);

    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: authMock }],
    });
  });

  it('calls login with the attempted URL and blocks an unauthenticated user', async () => {
    expect(await runGuard()).toBe(false);
    expect(authMock.login).toHaveBeenCalledWith(MOCK_URL);
  });

  it('allows an authenticated user without starting login', async () => {
    authMock.ensureAuthenticated.mockResolvedValue(true);

    expect(await runGuard()).toBe(true);
    expect(authMock.login).not.toHaveBeenCalled();
  });

  it('passes the current attempted URL to login', async () => {
    const target = '/checkout/payment';

    await runGuard(target);

    expect(authMock.login).toHaveBeenCalledWith(target);
  });
});