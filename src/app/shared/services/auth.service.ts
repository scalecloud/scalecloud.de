
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { LogService } from './log/log.service';
import { SnackBarService } from './snackbar/snack-bar.service';
import { ReturnUrlService } from './redirect/return-url.service';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private user: User | null | undefined = undefined;
  private token: string | null | undefined = undefined;

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly logService: LogService,
    private readonly returnUrlService: ReturnUrlService,
  ) {
    this.afAuth.useDeviceLanguage();
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
    return this.afAuth.user;
  }

  getTokenObservable(): Observable<string | null> {
    return this.afAuth.idToken;
  }

  async getUserPromise(): Promise<User | null> {
    await this.authStateReady();
    return this.afAuth.currentUser;
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

  setUser(user: User | null) {
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.getToken()
      })
    };
  }

  async login(email: string, password: string): Promise<void> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUser(result.user);
        this.returnUrlService.openReturnURL('/dashboard');
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  register(email: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUser(result.user);
        this.sendVerificationMail();
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  sendVerificationMail() {
    let actionCodeSettings = {
      url: this.returnUrlService.getReturnUrlDecoded(),
    };
    this.afAuth.currentUser.then((user) => {
      user.sendEmailVerification(actionCodeSettings)
        .then(() => {
          this.snackBarService.infoDuration('Please check your E-Mail for verification.', 30);
          this.returnUrlService.openUrlKeepReturnUrl('/verify-email-address');
        })
        .catch((error) => {
          this.snackBarService.error(error.message);
        });
    })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  async forgotPassword(passwordResetEmail: string): Promise<boolean> {
    let result = false;
    await this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
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
    if (this.getUser()) {
      await this.getUser().reload()
        .catch((error) => {
          this.logService.error(error.message);
        });
    }
    else {
      this.logService.error("Could not reload user, because user is null.");
    }
  }

  async authStateReady(): Promise<void> {
    const timeoutDuration = 4000; // 4 seconds

    if (this.getUser() === undefined) {
      await firstValueFrom(this.getUserObservable().pipe(timeout(timeoutDuration)));
    }
    if (this.getToken() === undefined) {
      await firstValueFrom(this.getTokenObservable().pipe(timeout(timeoutDuration)));
    }
    if (this.getUser() === undefined) {
      this.logService.warn("User should not be undefined.");
    }
    if (this.getToken() === undefined) {
      this.logService.warn("Token should not be undefined.");
    }
  }

  async waitForAuth(): Promise<void> {
    await this.authStateReady();
    await new Promise<void>((resolve) => {
      const subscription = this.getUserObservable().subscribe((user) => {
        if (user) {
          subscription.unsubscribe();
          resolve();
        }
      });
    });
  }

  async isLoggedIn(waitAuthStateReady: boolean): Promise<boolean> {
    if (waitAuthStateReady) {
      await this.authStateReady();
    }
    let user = this.getUser();
    return user && user?.emailVerified;
  }

  async isLoggedInNotVerified(waitAuthStateReady: boolean): Promise<boolean> {
    if (waitAuthStateReady) {
      await this.authStateReady();
    }
    const user = this.getUser();
    return user && !user?.emailVerified;
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}