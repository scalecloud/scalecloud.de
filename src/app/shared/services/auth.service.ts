
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LogService } from './log/log.service';
import { SnackBarService } from './snackbar/snack-bar.service';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: any;
  token: string | null | undefined;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public snackBarService: SnackBarService,
    private logService: LogService
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
    this.subscribeToToken();
  }

  subscribeToToken() {
   this.afAuth.idToken.subscribe((token) => {
      this.token = token;
    });
  }

  getToken(): string {
    let ret = '';
    if( this.token != null && this.token != undefined ) {
      ret = this.token;
    }
    else {
      this.logService.warn('Token is null or undefined');
    }
    return ret;
  }


  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user).then(() => {
          this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          });
        });
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  register(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user).then(() => {
          this.sendVerificationMail().then(() => {
            this.router.navigate(['verify-email-address']);
          });
        });
        
        
        
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  sendVerificationMail() {
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

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified === true ? true : false;
  }

  get isLoggedInNotVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified === false ? true : false;
  }

  setUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  async signOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['']);
  }
}