
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { LogService } from './log/log.service';
import { SnackBarService } from './snackbar/snack-bar.service';
import { ReturnUrlService } from './redirect/return-url.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {



  user: User | null = null;
  token: string | null = null;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private snackBarService: SnackBarService,
    private logService: LogService,
    private returnUrlService: ReturnUrlService,
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
    return this.afAuth.user;
  }

  getTokenObservable(): Observable<string | null> {
    return this.afAuth.idToken;
  }

  async getUserPromise(): Promise<User | null> {
    return this.afAuth.currentUser;
  }

  async getTokenPromise(): Promise<string> {
    try {
      const user = await this.getUser();
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
    this.logService.info('setUser: ' + JSON.stringify(this.user));
  }

  getUser(): User | null {
    return this.user;
  }

  setToken(token: string | null) {
    this.token = token;
    this.logService.info('setToken: ' + JSON.stringify(this.token));
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
    var actionCodeSettings = {
      url: this.returnUrlService.getReturnUrlDecoded(),
    };
    this.afAuth.currentUser.then((user) => {
      user.sendEmailVerification(actionCodeSettings)
      this.snackBarService.infoDuration('Please check your E-Mail for verification.', 30);
      this.returnUrlService.openUrlKeepReturnUrl('/verify-email-address');
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
    if (this.user) {
      await this.user.reload();
      const user = await this.afAuth.currentUser;
      this.setUser(user);
      const token = await this.getTokenPromise();
      this.setToken(token);
    }
  }

  isLoggedIn(): boolean {
    return Boolean(this.getUser()) && this.getUser()?.emailVerified;
  }

  isLoggedInNotVerified(): boolean {
    return Boolean(this.getUser()) && !this.getUser()?.emailVerified;
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}