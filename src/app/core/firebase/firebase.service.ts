import { Injectable, InjectionToken, inject } from '@angular/core';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  ActionCodeSettings,
  Auth,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getPerformance } from 'firebase/performance';
import { environment } from 'src/environments/environment';

/**
 * Injection tokens wrapping the four Firebase SDK factory functions that run
 * at construction time.
 *
 * Why tokens instead of `vi.mock('firebase/app', ...)` etc. in tests: this
 * project's esbuild-bundled Angular unit-test runner does not reliably apply
 * `vi.mock` on a bare module specifier once that module is reached from more
 * than one source file with different mock shapes - it silently falls
 * through to the real SDK instead of the mock (see the identical note in
 * auth.service.spec.ts, which hit this with 'firebase/auth' and worked
 * around it by substituting FirebaseService itself via DI). FirebaseService
 * is the SDK boundary, so it can't be substituted from within its own spec -
 * these tokens push the same DI-substitution trick one level deeper instead.
 * Angular's DI is a plain runtime object swap and isn't affected by the
 * module-resolution issue.
 */
export const INITIALIZE_APP = new InjectionToken<typeof initializeApp>('initializeApp', {
  providedIn: 'root',
  factory: () => initializeApp,
});
export const GET_AUTH = new InjectionToken<typeof getAuth>('getAuth', {
  providedIn: 'root',
  factory: () => getAuth,
});
export const GET_ANALYTICS = new InjectionToken<typeof getAnalytics>('getAnalytics', {
  providedIn: 'root',
  factory: () => getAnalytics,
});
export const GET_PERFORMANCE = new InjectionToken<typeof getPerformance>('getPerformance', {
  providedIn: 'root',
  factory: () => getPerformance,
});

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private readonly initializeAppFn = inject(INITIALIZE_APP);
  private readonly getAuthFn = inject(GET_AUTH);
  private readonly getAnalyticsFn = inject(GET_ANALYTICS);
  private readonly getPerformanceFn = inject(GET_PERFORMANCE);

  private app = this.initializeAppFn(environment.firebaseConfig);
  auth: Auth = this.getAuthFn(this.app);
  analytics: Analytics = this.getAnalyticsFn(this.app);
  perf = this.getPerformanceFn(this.app);

  /**
   * Thin wrappers around the firebase/auth free functions.
   *
   * Auth depends on these methods rather than importing firebase/auth
   * directly, so tests can mock them via Angular DI (TestBed `useValue`),
   * which is a plain runtime object swap. Mocking firebase/auth itself via
   * `vi.mock` is unreliable under the esbuild-bundled Angular unit-test
   * runner once the module is reached from more than one source file.
   */

  onAuthStateChanged(
    next: (user: User | null) => void,
    error?: (error: Error) => void,
  ): () => void {
    return onAuthStateChanged(this.auth, next, error);
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  createUserWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  sendEmailVerification(user: User, actionCodeSettings?: ActionCodeSettings): Promise<void> {
    return sendEmailVerification(user, actionCodeSettings);
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }
}