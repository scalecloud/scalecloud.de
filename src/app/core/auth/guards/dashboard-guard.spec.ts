import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { dashboardGuard } from './dashboard-guard';
import { Auth } from '../auth';

const mockAuth = {
  ensureAuthenticated: vi.fn(),
  login: vi.fn(),
};

const MOCK_URL = '/dashboard/overview';

function runGuard(url = MOCK_URL): Promise<boolean> {
  return TestBed.runInInjectionContext(() =>
    dashboardGuard(null!, { url } as RouterStateSnapshot) as Promise<boolean>
  );
}

describe('dashboardGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: mockAuth }],
    });
  });

  describe('when the user has no valid session', () => {
    beforeEach(() => {
      mockAuth.ensureAuthenticated.mockResolvedValue(false);
    });

    it('starts the Authentik login with the attempted URL as return target', async () => {
      await runGuard();
      expect(mockAuth.login).toHaveBeenCalledWith(MOCK_URL);
    });

    it('passes whatever URL was attempted', async () => {
      await runGuard('/dashboard/settings');
      expect(mockAuth.login).toHaveBeenCalledWith('/dashboard/settings');
    });

    it('blocks activation', async () => {
      expect(await runGuard()).toBe(false);
    });
  });

  describe('when the user has a valid session', () => {
    beforeEach(() => {
      mockAuth.ensureAuthenticated.mockResolvedValue(true);
    });

    it('allows activation', async () => {
      expect(await runGuard()).toBe(true);
    });

    it('does not start a login', async () => {
      await runGuard();
      expect(mockAuth.login).not.toHaveBeenCalled();
    });
  });
});