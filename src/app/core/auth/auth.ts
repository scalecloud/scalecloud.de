import { DestroyRef, Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import type { User } from 'firebase/auth';

import { Log } from '../logging/log';
import { SnackBar } from '../snackbar/snack-bar';
import { ReturnUrl } from '../redirect/return-url';
import { Firebase } from '../firebase/firebase';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly router = inject(Router);
  private readonly snackBar = inject(SnackBar);
  private readonly log = inject(Log);
  private readonly returnUrl = inject(ReturnUrl);
  private readonly firebase = inject(Firebase);
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
    const unsubscribe = this.firebase.onAuthStateChanged(
      (user) => this.handleAuthStateChanged(user),
      (error) => this.log.error('Auth state listener failed: ' + error.message),
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
      this.log.error('Could not refresh ID token: ' + (error as Error).message);
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
      const result = await this.firebase.signInWithEmailAndPassword(email, password);
      this.userSignal.set(result.user);
      this.returnUrl.openReturnURL('/dashboard');
    } catch (error) {
      this.snackBar.error((error as Error).message);
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      const result = await this.firebase.createUserWithEmailAndPassword(email, password);
      this.userSignal.set(result.user);
      await this.sendVerificationMail();
    } catch (error) {
      this.snackBar.error((error as Error).message);
    }
  }

  async sendVerificationMail(): Promise<void> {
    const user = this.firebase.auth.currentUser;
    if (!user) {
      this.snackBar.error('No user logged in.');
      return;
    }

    const actionCodeSettings = { url: this.returnUrl.getReturnUrlDecoded() };

    try {
      await this.firebase.sendEmailVerification(user, actionCodeSettings);
      this.snackBar.infoDuration('Please check your E-Mail for verification.', 30);
      this.returnUrl.openUrlKeepReturnUrl('/verify-email-address');
    } catch (error) {
      this.snackBar.error((error as Error).message);
    }
  }

  async forgotPassword(passwordResetEmail: string): Promise<boolean> {
    try {
      await this.firebase.sendPasswordResetEmail(passwordResetEmail);
      this.snackBar.infoDuration('Please check your E-Mail for further instructions.', 30);
      return true;
    } catch (error) {
      this.snackBar.error((error as Error).message);
      return false;
    }
  }

  async reloadUser(): Promise<void> {
    const user = this.user();
    if (!user) {
      this.log.error('Could not reload user, because user is null.');
      return;
    }
    try {
      await user.reload();
    } catch (error) {
      this.log.error((error as Error).message);
    }
  }

  async authStateReady(): Promise<void> {
    const timeoutDuration = 4000;

    if (this.user() === undefined) {
      await this.waitForNextAuthStateChange(timeoutDuration).catch((error) =>
        this.log.warn((error as Error).message),
      );
    }

    if (this.token() === undefined) {
      const user = this.firebase.auth.currentUser;
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
      const unsubscribe = this.firebase.onAuthStateChanged((user) => {
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
      const unsubscribe = this.firebase.onAuthStateChanged((user) => {
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
    await this.firebase.signOut();
    this.router.navigate(['/']);
  }
}