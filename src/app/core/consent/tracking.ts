import { EnvironmentInjector, Injectable, effect, inject, untracked } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Consent } from './consent';
import { Log } from '../logging/log';

@Injectable({ providedIn: 'root' })
export class Tracking {
  private readonly consent = inject(Consent);
  private readonly injector = inject(EnvironmentInjector);
  private readonly log = inject(Log);

  private analyticsStarted = false;
  private errorMonitoringStarted = false;

  constructor() {
    effect(() => {
      const analytics = this.consent.analytics();
      const errorMonitoring = this.consent.errorMonitoring();

      untracked(() => {
        const analyticsWithdrawn = this.analyticsStarted && !analytics;
        const errorMonitoringWithdrawn = this.errorMonitoringStarted && !errorMonitoring;

        if (analyticsWithdrawn || errorMonitoringWithdrawn) {
          if (analyticsWithdrawn) {
            this.clearGoogleCookies();
          }
          location.reload();
          return;
        }

        if (analytics && !this.analyticsStarted) {
          this.analyticsStarted = true;
          void this.startAnalytics();
        }
        if (errorMonitoring && !this.errorMonitoringStarted) {
          this.errorMonitoringStarted = true;
          void this.startErrorMonitoring();
        }
      });
    });
  }

  private async startAnalytics(): Promise<void> {
    try {
      const { Firebase } = await import('../firebase/firebase');
      this.injector.get(Firebase);
    } catch (error) {
      this.analyticsStarted = false;
      this.log.error('Analytics initialization failed', error);
    }
  }

  private async startErrorMonitoring(): Promise<void> {
    try {
      const Sentry = await import('@sentry/angular');
      Sentry.init({
        dsn: 'https://37ae26106eaa1531ba2941ee13b103c5@o4508966853083136.ingest.de.sentry.io/4508971996872784',
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
        ],
        environment: environment.production ? 'production' : 'development',
        tracesSampleRate: 0.2,
        tracePropagationTargets: ['localhost', /^https:\/\/api\.scalecloud\.de/],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
      this.injector.get(Sentry.TraceService);
    } catch (error) {
      this.errorMonitoringStarted = false;
      this.log.error('Error monitoring initialization failed', error);
    }
  }

  private clearGoogleCookies(): void {
    const host = location.hostname;
    const parent = '.' + host.split('.').slice(-2).join('.');
    const domains = [host, '.' + host, parent];

    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_')) {
        document.cookie = `${name}=; Max-Age=0; path=/`;
        for (const domain of domains) {
          document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
        }
      }
    }
  }
}