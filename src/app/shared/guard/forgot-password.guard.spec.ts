import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { forgotPasswordGuard } from './forgot-password.guard';
import { AuthService } from '../services/auth.service';

const mockRouter = { navigate: vi.fn() };
const mockAuthService = {
  isLoggedIn: vi.fn(),
  isLoggedInNotVerified: vi.fn(),
};

function runGuard(): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    forgotPasswordGuard({} as any, {} as any) as Promise<boolean>
  );
}

describe('forgotPasswordGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  describe('when the user is fully logged in and verified', () => {
    beforeEach(() => {
      mockAuthService.isLoggedIn.mockResolvedValue(true);
      mockAuthService.isLoggedInNotVerified.mockResolvedValue(false);
    });

    it('redirects to /dashboard', async () => {
      await runGuard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });

    it('does not check verification status when already logged in', async () => {
      await runGuard();
      expect(mockAuthService.isLoggedInNotVerified).not.toHaveBeenCalled();
    });
  });

  describe('when the user is logged in but unverified', () => {
    beforeEach(() => {
      mockAuthService.isLoggedIn.mockResolvedValue(false);
      mockAuthService.isLoggedInNotVerified.mockResolvedValue(true);
    });

    it('redirects to /verify-email-address', async () => {
      await runGuard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/verify-email-address']);
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });
  });

  describe('when the user is not logged in and not pending verification (the forgot-password page is intended for them)', () => {
    beforeEach(() => {
      mockAuthService.isLoggedIn.mockResolvedValue(false);
      mockAuthService.isLoggedInNotVerified.mockResolvedValue(false);
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