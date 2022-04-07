
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { SnackBarService } from './snackbar/snack-bar.service';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: any;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public snackBarService: SnackBarService
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
        this.sendVerificationMail();
        this.setUserData(result.user);
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  async forgotPassword(passwordResetEmail: string): Promise<boolean> {
    let result = false;
    await this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        result = true;
        this.snackBarService.infoDuration('Please check your E-Mail for further instructions.', 60);
      })
      .catch((error) => {
        this.snackBarService.error(error.message);
      });
    return result;
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
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