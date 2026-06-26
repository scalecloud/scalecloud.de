import { Injectable } from '@angular/core';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { getPerformance } from 'firebase/performance';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  auth: Auth = getAuth(this.app);
  analytics: Analytics = getAnalytics(this.app);
  perf = getPerformance(this.app);
}
