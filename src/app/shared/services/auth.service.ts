import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/compat/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async login(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        console.log('Nice, it worked!');
        this.router.navigateByUrl('/');
        this.updateUserData(credential.user);
      })
      .catch(err => {
        console.log('Something went wrong: ', err.message);
      });
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user: firebase.User | null) {
    // Sets user data to firestore on login
    var ret = null;
    if (user) {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
      if (user.email && user.displayName && user.photoURL) {
        const data = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        ret = userRef.set(data, { merge: true });
      }
      else {
        console.log("User data incomplete");
      }
    }
    return ret;
  }

}