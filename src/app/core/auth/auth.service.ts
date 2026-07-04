import { DestroyRef, Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import type { User } from 'firebase/auth';

import { LogService } from '../logging/log.service';
import { SnackBarService } from '../snackbar/snack-bar.service';
import { FirebaseService } from 'src/app/core/firebase/firebase.service';
import { ReturnUrlService } from '../redirect/return-url.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);
  private readonly logService = inject(LogService);
  private readonly returnUrlService = inject(ReturnUrlService);
  private readonly firebaseService = inject(FirebaseService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly userSignal = signal<User | null | undefined>(undefined);
  private readonly tokenSignal = signal<string | null | undefined>(undefined);

  /** Current Firebase user: `undefined` until the first auth-state event, `null` when signed out. */
  readonly user: Signal<User | null | undefined> = this.userSignal.asReadonly();
  /** Mirrors `user`'s lifecycle; refreshed on every auth-state change. */
  readonly token: Signal<string | null | undefined> = this.tokenSignal.asReadonly();
  /** True once a verified user is present. For code that must wait for the initial auth state, use isLoggedIn() instead. */
  readonly isAuthenticated: Signal<boolean> = computed(() => !!this.userSignal()?.emailVerified);

  constructor() {
    const unsubscribe = this.firebaseService.onAuthStateChanged(
      (user) => this.handleAuthStateChanged(user),
      (error) => this.logService.error('Auth state listener failed: ' + error.message),
    );
    this.destroyRef.onDestroy(unsubscribe);
  }

  private async handleAuthStateChanged(user: User | null): Promise<void> {
    this.userSignal.set(user);

    if (!user) {
      this.tokenSignal.set(null);
      return;
    }

    try {
      this.tokenSignal.set(await user.getIdToken());
    } catch (error) {
      this.logService.error('Could not refresh ID token: ' + (error as Error).message);
      this.tokenSignal.set(null);
    }
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: this.token() ?? '',
      }),
    };
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const result = await this.firebaseService.signInWithEmailAndPassword(email, password);
      this.userSignal.set(result.user);
      this.returnUrlService.openReturnURL('/dashboard');
    } catch (error) {
      this.snackBarService.error((error as Error).message);
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      const result = await this.firebaseService.createUserWithEmailAndPassword(email, password);
      this.userSignal.set(result.user);
      await this.sendVerificationMail();
    } catch (error) {
      this.snackBarService.error((error as Error).message);
    }
  }

  async sendVerificationMail(): Promise<void> {
    const user = this.firebaseService.auth.currentUser;
    if (!user) {
      this.snackBarService.error('No user logged in.');
      return;
    }

    const actionCodeSettings = { url: this.returnUrlService.getReturnUrlDecoded() };

    try {
      await this.firebaseService.sendEmailVerification(user, actionCodeSettings);
      this.snackBarService.infoDuration('Please check your E-Mail for verification.', 30);
      this.returnUrlService.openUrlKeepReturnUrl('/verify-email-address');
    } catch (error) {
      this.snackBarService.error((error as Error).message);
    }
  }

  async forgotPassword(passwordResetEmail: string): Promise<boolean> {
    try {
      await this.firebaseService.sendPasswordResetEmail(passwordResetEmail);
      this.snackBarService.infoDuration('Please check your E-Mail for further instructions.', 30);
      return true;
    } catch (error) {
      this.snackBarService.error((error as Error).message);
      return false;
    }
  }

  async reloadUser(): Promise<void> {
    const user = this.user();
    if (!user) {
      this.logService.error('Could not reload user, because user is null.');
      return;
    }
    try {
      await user.reload();
    } catch (error) {
      this.logService.error((error as Error).message);
    }
  }

  async authStateReady(): Promise<void> {
    const timeoutDuration = 4000;

    if (this.user() === undefined) {
      await this.waitForNextAuthStateChange(timeoutDuration).catch((error) =>
        this.logService.warn((error as Error).message),
      );
    }

    if (this.token() === undefined) {
      const user = this.firebaseService.auth.currentUser;
      if (user) {
        this.tokenSignal.set(await user.getIdToken());
      } else {
        this.tokenSignal.set(null);
      }
    }
  }

  private waitForNextAuthStateChange(timeoutDuration: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Auth state timeout')), timeoutDuration);
      const unsubscribe = this.firebaseService.onAuthStateChanged((user) => {
        clearTimeout(timer);
        unsubscribe();
        this.userSignal.set(user);
        resolve();
      });
    });
  }

  async waitForAuth(): Promise<void> {
    await this.authStateReady();
    if (this.user()) {
      return;
    }

    await new Promise<void>((resolve) => {
      const unsubscribe = this.firebaseService.onAuthStateChanged((user) => {
        if (user) {
          unsubscribe();
          this.userSignal.set(user);
          resolve();
        }
      });
    });
  }

  async isLoggedIn(waitAuthStateReady: boolean): Promise<boolean> {
    if (waitAuthStateReady) await this.authStateReady();
    const user = this.user();
    return !!(user && user.emailVerified);
  }

  async isLoggedInNotVerified(waitAuthStateReady: boolean): Promise<boolean> {
    if (waitAuthStateReady) await this.authStateReady();
    const user = this.user();
    return !!(user && !user.emailVerified);
  }

  async signOut(): Promise<void> {
    await this.firebaseService.signOut();
    this.router.navigate(['/']);
  }
}