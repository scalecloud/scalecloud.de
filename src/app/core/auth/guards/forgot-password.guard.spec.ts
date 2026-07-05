import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { forgotPasswordGuard } from './forgot-password.guard';
import { Auth } from '../auth';


const mockRouter = { navigate: vi.fn() };
const mockAuth = {
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

    it('does not check verification status when already logged in', async () => {
      await runGuard();
      expect(mockAuth.isLoggedInNotVerified).not.toHaveBeenCalled();
    });
  });

  describe('when the user is logged in but unverified', () => {
    beforeEach(() => {
      mockAuth.isLoggedIn.mockResolvedValue(false);
      mockAuth.isLoggedInNotVerified.mockResolvedValue(true);
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
      mockAuth.isLoggedIn.mockResolvedValue(false);
      mockAuth.isLoggedInNotVerified.mockResolvedValue(false);
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