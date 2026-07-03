import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, beforeEach, afterEach, it, expect, vi, type Mock } from 'vitest';
import type { User } from 'firebase/auth';

import { AuthService } from './auth.service';
import { LogService } from './log/log.service';
import { SnackBarService } from './snackbar/snack-bar.service';
import { ReturnUrlService } from './redirect/return-url.service';
import { FirebaseService } from 'src/app/services/firebase.service';

// ── Firebase module mocks ────────────────────────────────────────────────────
// AuthService calls these at construction and call time, so they must be
// mocked before the module under test is imported (vi.mock is hoisted).

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
}));

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';

// ── Helpers ────────────────────────────────────────────────────────────────

type AuthStateCallback = (user: User | null) => void;
interface Registration {
  next: AuthStateCallback;
  error?: (error: Error) => void;
  unsubscribe: Mock;
}

function makeUser(overrides: Partial<User> = {}): User {
  return {
    uid: 'uid-1',
    email: 'user@example.com',
    emailVerified: true,
    getIdToken: vi.fn(async () => 'token-abc'),
    reload: vi.fn(async () => undefined),
    ...overrides,
  } as unknown as User;
}

describe('AuthService', () => {
  let service: AuthService;
  let registrations: Registration[];

  const router = { navigate: vi.fn() };
  const snackBarService = { info: vi.fn(), infoDuration: vi.fn(), warn: vi.fn(), warnDuration: vi.fn(), error: vi.fn(), errorDuration: vi.fn() };
  const logService = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const returnUrlService = {
    openReturnURL: vi.fn(),
    openUrlKeepReturnUrl: vi.fn(),
    getReturnUrlDecoded: vi.fn(() => 'https://example.com/verify'),
  };
  const firebaseAuth = { currentUser: null as User | null };
  const firebaseService = { auth: firebaseAuth };

  function createService(): AuthService {
    return TestBed.inject(AuthService);
  }

  /** Resolves the current registration's user.getIdToken() microtask chain. */
  async function flush(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
  }

  beforeEach(() => {
    vi.clearAllMocks();
    registrations = [];
    firebaseAuth.currentUser = null;

    (onAuthStateChanged as unknown as Mock).mockImplementation(
      (_auth: unknown, next: AuthStateCallback, error?: (err: Error) => void) => {
        const unsubscribe = vi.fn();
        registrations.push({ next, error, unsubscribe });
        return unsubscribe;
      },
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: SnackBarService, useValue: snackBarService },
        { provide: LogService, useValue: logService },
        { provide: ReturnUrlService, useValue: returnUrlService },
        { provide: FirebaseService, useValue: firebaseService },
      ],
    });

    service = createService();
  });

  afterEach(() => {
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register exactly one onAuthStateChanged listener on construction', () => {
    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(registrations).toHaveLength(1);
  });

  it('should clean up the auth listener via DestroyRef.onDestroy', () => {
    const unsubscribe = registrations[0].unsubscribe;
    expect(unsubscribe).not.toHaveBeenCalled();

    // Destroying the injector that created the service invokes every
    // DestroyRef.onDestroy callback registered within it - this exercises
    // the real DestroyRef instead of a mocked one, which Angular does not
    // let you substitute for a providedIn: 'root' service.
    TestBed.resetTestingModule();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  describe('reacting to auth state changes', () => {
    it('should update user() and token() when a user signs in', async () => {
      const user = makeUser({ getIdToken: vi.fn(async () => 'fresh-token') });

      registrations[0].next(user);
      await flush();

      expect(service.user()).toBe(user);
      expect(service.token()).toBe('fresh-token');
    });

    it('should set user() and token() to null when signed out', async () => {
      registrations[0].next(makeUser());
      await flush();

      registrations[0].next(null);
      await flush();

      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
    });

    it('should log an error and set token() to null when getIdToken() rejects', async () => {
      const user = makeUser({ getIdToken: vi.fn(async () => { throw new Error('token error'); }) });

      registrations[0].next(user);
      await flush();

      expect(logService.error).toHaveBeenCalledWith('Could not refresh ID token: token error');
      expect(service.token()).toBeNull();
    });

    it('should log an error when the auth state listener itself errors', () => {
      registrations[0].error?.(new Error('listener broke'));

      expect(logService.error).toHaveBeenCalledWith('Auth state listener failed: listener broke');
    });

    it('isAuthenticated should be true only for a verified user', async () => {
      registrations[0].next(makeUser({ emailVerified: true }));
      await flush();
      expect(service.isAuthenticated()).toBe(true);

      registrations[0].next(makeUser({ emailVerified: false }));
      await flush();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getHttpOptions', () => {
    it('should send the current token as the Authorization header', async () => {
      registrations[0].next(makeUser({ getIdToken: vi.fn(async () => 'abc-123') }));
      await flush();

      expect(service.getHttpOptions().headers.get('Authorization')).toBe('abc-123');
    });

    it('should send an empty Authorization header when there is no token', () => {
      expect(service.getHttpOptions().headers.get('Authorization')).toBe('');
    });
  });

  describe('login', () => {
    it('should sign in, update the user, and open the return URL on success', async () => {
      const user = makeUser();
      (signInWithEmailAndPassword as unknown as Mock).mockResolvedValue({ user });

      await service.login('user@example.com', 'secret');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(firebaseAuth, 'user@example.com', 'secret');
      expect(service.user()).toBe(user);
      expect(returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
    });

    it('should show an error snackbar and not navigate on failure', async () => {
      (signInWithEmailAndPassword as unknown as Mock).mockRejectedValue(new Error('bad credentials'));

      await service.login('user@example.com', 'wrong');

      expect(snackBarService.error).toHaveBeenCalledWith('bad credentials');
      expect(returnUrlService.openReturnURL).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create the account, set the user, and send a verification mail on success', async () => {
      const user = makeUser();
      (createUserWithEmailAndPassword as unknown as Mock).mockResolvedValue({ user });
      (sendEmailVerification as unknown as Mock).mockResolvedValue(undefined);
      firebaseAuth.currentUser = user;

      await service.register('new@example.com', 'secret');

      expect(service.user()).toBe(user);
      expect(sendEmailVerification).toHaveBeenCalledWith(user, { url: 'https://example.com/verify' });
      expect(snackBarService.infoDuration).toHaveBeenCalledWith(
        'Please check your E-Mail for verification.',
        30,
      );
      expect(returnUrlService.openUrlKeepReturnUrl).toHaveBeenCalledWith('/verify-email-address');
    });

    it('should show an error snackbar on failure', async () => {
      (createUserWithEmailAndPassword as unknown as Mock).mockRejectedValue(new Error('email in use'));

      await service.register('new@example.com', 'secret');

      expect(snackBarService.error).toHaveBeenCalledWith('email in use');
    });
  });

  describe('sendVerificationMail', () => {
    it('should show an error and not call sendEmailVerification when no user is logged in', async () => {
      firebaseAuth.currentUser = null;

      await service.sendVerificationMail();

      expect(snackBarService.error).toHaveBeenCalledWith('No user logged in.');
      expect(sendEmailVerification).not.toHaveBeenCalled();
    });

    it('should show an error snackbar when sendEmailVerification fails', async () => {
      const user = makeUser();
      firebaseAuth.currentUser = user;
      (sendEmailVerification as unknown as Mock).mockRejectedValue(new Error('quota exceeded'));

      await service.sendVerificationMail();

      expect(snackBarService.error).toHaveBeenCalledWith('quota exceeded');
    });
  });

  describe('forgotPassword', () => {
    it('should return true and show an info snackbar on success', async () => {
      (sendPasswordResetEmail as unknown as Mock).mockResolvedValue(undefined);

      const result = await service.forgotPassword('user@example.com');

      expect(result).toBe(true);
      expect(snackBarService.infoDuration).toHaveBeenCalledWith(
        'Please check your E-Mail for further instructions.',
        30,
      );
    });

    it('should return false and show an error snackbar on failure', async () => {
      (sendPasswordResetEmail as unknown as Mock).mockRejectedValue(new Error('no such user'));

      const result = await service.forgotPassword('missing@example.com');

      expect(result).toBe(false);
      expect(snackBarService.error).toHaveBeenCalledWith('no such user');
    });
  });

  describe('reloadUser', () => {
    it('should reload the current user', async () => {
      const user = makeUser();
      registrations[0].next(user);
      await flush();

      await service.reloadUser();

      expect(user.reload).toHaveBeenCalled();
    });

    it('should log an error when reload() rejects', async () => {
      const user = makeUser({ reload: vi.fn(async () => { throw new Error('reload failed'); }) });
      registrations[0].next(user);
      await flush();

      await service.reloadUser();

      expect(logService.error).toHaveBeenCalledWith('reload failed');
    });

    it('should log an error when there is no user to reload', async () => {
      await service.reloadUser();

      expect(logService.error).toHaveBeenCalledWith('Could not reload user, because user is null.');
    });
  });

  describe('authStateReady', () => {
    it('should resolve immediately when user and token are already known', async () => {
      registrations[0].next(makeUser());
      await flush();
      vi.clearAllMocks();

      await service.authStateReady();

      expect(onAuthStateChanged).not.toHaveBeenCalled();
    });

    it('should wait for the next auth state event when user is still undefined', async () => {
      const user = makeUser();
      const readyPromise = service.authStateReady();

      expect(registrations).toHaveLength(2);
      registrations[1].next(user);
      await readyPromise;

      expect(service.user()).toBe(user);
    });

    it('should log a warning when no auth state event arrives before the timeout', async () => {
      vi.useFakeTimers();
      const readyPromise = service.authStateReady();

      await vi.advanceTimersByTimeAsync(4000);
      await readyPromise;

      expect(logService.warn).toHaveBeenCalledWith('Auth state timeout');
    });

    it('should fetch the token from currentUser when token is still undefined', async () => {
      const user = makeUser({ getIdToken: vi.fn(async () => 'late-token') });
      firebaseAuth.currentUser = user;
      const readyPromise = service.authStateReady();

      registrations[1].next(user);
      await readyPromise;

      expect(service.token()).toBe('late-token');
    });
  });

  describe('waitForAuth', () => {
    it('should resolve once a user is present after authStateReady', async () => {
      const user = makeUser();
      firebaseAuth.currentUser = user;
      const waitPromise = service.waitForAuth();

      registrations[1].next(user);
      await waitPromise;

      expect(service.user()).toBe(user);
    });

    it('should keep waiting through a null emission until a real user arrives', async () => {
      firebaseAuth.currentUser = null;
      const waitPromise = service.waitForAuth();

      registrations[1].next(null);

      // authStateReady() chains a `.catch()` onto the internal wait promise
      // and waitForAuth() then awaits authStateReady() itself before
      // registering the next listener - each of those hops costs a
      // microtask tick, so a single `await Promise.resolve()` isn't enough
      // to guarantee registrations[2] exists yet. Poll instead of counting ticks.
      await vi.waitFor(() => {
        expect(registrations).toHaveLength(3);
      });

      const user = makeUser();
      registrations[2].next(null);
      registrations[2].next(user);

      await waitPromise;

      expect(service.user()).toBe(user);
    });
  });

  describe('isLoggedIn / isLoggedInNotVerified', () => {
    it('isLoggedIn should be true for a verified user without waiting', async () => {
      registrations[0].next(makeUser({ emailVerified: true }));
      await flush();

      expect(await service.isLoggedIn(false)).toBe(true);
    });

    it('isLoggedIn should be false for an unverified user', async () => {
      registrations[0].next(makeUser({ emailVerified: false }));
      await flush();

      expect(await service.isLoggedIn(false)).toBe(false);
    });

    it('isLoggedInNotVerified should be true for an unverified user', async () => {
      registrations[0].next(makeUser({ emailVerified: false }));
      await flush();

      expect(await service.isLoggedInNotVerified(false)).toBe(true);
    });

    it('isLoggedInNotVerified should be false when there is no user', async () => {
      await expect(service.isLoggedInNotVerified(false)).resolves.toBe(false);
    });
  });

  describe('signOut', () => {
    it('should sign out and navigate to the root route', async () => {
      (signOut as unknown as Mock).mockResolvedValue(undefined);

      await service.signOut();

      expect(signOut).toHaveBeenCalledWith(firebaseAuth);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});