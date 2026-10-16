import { Injectable, InjectionToken, inject } from '@angular/core';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { environment } from 'src/environments/environment';

/**
 * Injection tokens wrapping the three Firebase SDK factory functions that run
 * at construction time.
 *
 * These tokens let unit tests substitute the SDK factory functions through
 * Angular DI instead of relying on module-level mocks.
 */
export const INITIALIZE_APP = new InjectionToken<typeof initializeApp>('initializeApp', {
  providedIn: 'root',
  factory: () => initializeApp,
});
export const GET_ANALYTICS = new InjectionToken<typeof getAnalytics>('getAnalytics', {
  providedIn: 'root',
  factory: () => getAnalytics,
});
export const GET_PERFORMANCE = new InjectionToken<typeof getPerformance>('getPerformance', {
  providedIn: 'root',
  factory: () => getPerformance,
});

@Injectable({ providedIn: 'root' })
export class Firebase {
  private readonly initializeAppFn = inject(INITIALIZE_APP);
  private readonly getAnalyticsFn = inject(GET_ANALYTICS);
  private readonly getPerformanceFn = inject(GET_PERFORMANCE);

  private readonly app = this.initializeAppFn(environment.firebaseConfig);
  analytics: Analytics = this.getAnalyticsFn(this.app);
  perf = this.getPerformanceFn(this.app);
}