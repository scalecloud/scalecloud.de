import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { verifyEMailGuard } from './verify-email.guard';
import { Auth } from '../auth';

const mockRouter = { navigate: vi.fn() };
const mockAuth = {
  isLoggedIn: vi.fn(),
  isLoggedInNotVerified: vi.fn(),
};

/** Run the guard inside Angular's DI context */
function runGuard(): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    verifyEMailGuard({} as any, {} as any) as Promise<boolean>
  );
}

describe('verifyEMailGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: mockAuth },
      ],
    });
  });

  describe('when the user is fully logged in and verified', () => {
    beforeEach(() => {
      mockAuth.isLoggedIn.mockResolvedValue(true);
      mockAuth.isLoggedInNotVerified.mockResolvedValue(false);
    });

    it('redirects to /dashboard', async () => {
      await runGuard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });
  });

  describe('when the user is not logged in and not in a pending-verification state', () => {
    beforeEach(() => {
      mockAuth.isLoggedIn.mockResolvedValue(false);
      mockAuth.isLoggedInNotVerified.mockResolvedValue(false);
    });

    it('redirects to /login', async () => {
      await runGuard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });
  });

  describe('when the user is logged in but unverified (the verify-email page is intended for them)', () => {
    beforeEach(() => {
      mockAuth.isLoggedIn.mockResolvedValue(false);
      mockAuth.isLoggedInNotVerified.mockResolvedValue(true);
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