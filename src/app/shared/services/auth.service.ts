
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LogService } from './log/log.service';
import { SnackBarService } from './snackbar/snack-bar.service';
import { ReturnUrlService } from './redirect/return-url.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: any;
  idToken: string | null | undefined;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private snackBarService: SnackBarService,
    private logService: LogService,
    private returnUrlService: ReturnUrlService,
  ) {
    this.subscribeToUser();
  }

  subscribeToUser() {
    this.afAuth.authState.subscribe((user) => {
      this.updateUser(user);
    });
  }

  updateUser( user: any ): void {
    this.user = user;
    this.user?.getIdToken().then((idToken: string) => {
      this.idToken = idToken;
    });
  }

  getToken(): string {
    let ret = '';
    if (this.idToken != null && this.idToken != undefined) {
      ret = this.idToken;
    }
    else {
      this.logService.warn('Token is null or undefined');
    }
    return ret;
  }

  async login(email: string, password: string): Promise<void> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.updateUser(result.user);
        this.returnUrlService.openReturnURL('/dashboard');
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  async register(email: string, password: string): Promise<void> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail().then(() => {
          this.updateUser(result.user);
          this.returnUrlService.openUrlKeepReturnUrl('/verify-email-address');
        });
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  async sendVerificationMail(): Promise<void> {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.snackBarService.infoDuration('Please check your E-Mail for verification.', 30);
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

  isLoggedIn(): boolean {
    return Boolean(this.user) && this.user?.emailVerified;
  }

  isLoggedInNotVerified(): boolean {
    return Boolean(this.user) && !this.user?.emailVerified;
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}