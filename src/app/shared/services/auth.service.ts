import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from './log/log.service';
import { SnackBarService } from './snackbar/snack-bar.service';
import { ReturnUrlService } from './redirect/return-url.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

import {
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { auth } from '../../app.module';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private user: User | null | undefined = undefined;
  private token: string | null | undefined = undefined;

  constructor(
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly logService: LogService,
    private readonly returnUrlService: ReturnUrlService,
  ) {
    this.subscribeToUser();
    this.subscribeToToken();
  }

  subscribeToUser() {
    this.getUserObservable().subscribe((user) => {
      this.setUser(user);
    });
  }

  subscribeToToken() {
    this.getTokenObservable().subscribe((token) => {
      this.setToken(token);
    });
  }

  getUserObservable(): Observable<User | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        subscriber.next(user);
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  getTokenObservable(): Observable<string | null> {
    // Gibt bei jedem Auth-State-Wechsel ein frisches Token aus
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          subscriber.next(token);
        } else {
          subscriber.next(null);
        }
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  async getUserPromise(): Promise<User | null> {
    await this.authStateReady();
    return auth.currentUser;
  }

  async getTokenPromise(): Promise<string> {
    try {
      const user = await this.getUserPromise();
      if (user) {
        return await user.getIdToken();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      this.logService.error(error.message);
      throw error;
    }
  }

  setUser(user: User | null) { this.user = user; }
  getUser(): User | null { return this.user; }

  setToken(token: string | null) { this.token = token; }
  getToken(): string | null { return this.token; }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.getToken()
      })
    };
  }

  async login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        this.setUser(result.user);
        this.returnUrlService.openReturnURL('/dashboard');
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  register(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        this.setUser(result.user);
        this.sendVerificationMail();
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  sendVerificationMail() {
    const actionCodeSettings = {
      url: this.returnUrlService.getReturnUrlDecoded(),
    };
    const user = auth.currentUser;
    if (!user) {
      this.snackBarService.error('No user logged in.');
      return;
    }
    sendEmailVerification(user, actionCodeSettings)
      .then(() => {
        this.snackBarService.infoDuration('Please check your E-Mail for verification.', 30);
        this.returnUrlService.openUrlKeepReturnUrl('/verify-email-address');
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  async forgotPassword(passwordResetEmail: string): Promise<boolean> {
    let result = false;
    await sendPasswordResetEmail(auth, passwordResetEmail)
      .then(() => {
        result = true;
        this.snackBarService.infoDuration('Please check your E-Mail for further instructions.', 30);
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
    return result;
  }

  async reloadUser(): Promise<void> {
    const user = this.getUser();
    if (user) {
      await user.reload().catch((error) => {
        this.logService.error(error.message);
      });
    } else {
      this.logService.error('Could not reload user, because user is null.');
    }
  }

  async authStateReady(): Promise<void> {
    const timeoutDuration = 4000;

    if (this.getUser() === undefined) {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Auth state timeout')), timeoutDuration);
        const unsub = onAuthStateChanged(auth, (user) => {
          clearTimeout(timer);
          unsub();
          this.setUser(user);
          resolve();
        });
      }).catch((err) => this.logService.warn(err.message));
    }

    if (this.getToken() === undefined) {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        this.setToken(token);
      } else {
        this.setToken(null);
      }
    }
  }

  async waitForAuth(): Promise<void> {
    await this.authStateReady();
    await new Promise<void>((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsub();
          resolve();
        }
      });
    });
  }

  async isLoggedIn(waitAuthStateReady: boolean): Promise<boolean> {
    if (waitAuthStateReady) await this.authStateReady();
    const user = this.getUser();
    return !!(user && user.emailVerified);
  }

  async isLoggedInNotVerified(waitAuthStateReady: boolean): Promise<boolean> {
    if (waitAuthStateReady) await this.authStateReady();
    const user = this.getUser();
    return !!(user && !user.emailVerified);
  }

  async signOut() {
    await signOut(auth);
    this.router.navigate(['/']);
  }
}