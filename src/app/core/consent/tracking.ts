import { EnvironmentInjector, Injectable, effect, inject, untracked } from '@angular/core';
import * as Sentry from '@sentry/angular';

import { environment } from '../../../environments/environment';
import { Consent } from './consent';
import { Log } from '../logging/log';

@Injectable({ providedIn: 'root' })
export class Tracking {
  private readonly consent = inject(Consent);
  private readonly injector = inject(EnvironmentInjector);
  private readonly log = inject(Log);

  private improvementsStarted = false;
  private stopSessionReplay: (() => Promise<void>) | null = null;

  constructor() {
    Sentry.init({
      dsn: 'https://37ae26106eaa1531ba2941ee13b103c5@o4508966853083136.ingest.de.sentry.io/4508971996872784',
      environment: environment.production ? 'production' : 'development',
      defaultIntegrations: false,
      integrations: [
        Sentry.globalHandlersIntegration(),
        Sentry.dedupeIntegration(),
      ],
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        stackFrameVariables: false,
        frameContextLines: 0,
      },
      tracesSampleRate: 0.2,
      tracePropagationTargets: ['localhost', /^https:\/\/api\.scalecloud\.de/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 0.1,
      beforeSendMetric: () => null,
    });

    effect(() => {
      const improvements = this.consent.improvements();

      untracked(() => {
        const improvementsWithdrawn = this.improvementsStarted && !improvements;

        if (improvementsWithdrawn) {
          this.clearGoogleCookies();
          if (this.stopSessionReplay) {
            void this.stopSessionReplay().catch(() => undefined).finally(() => location.reload());
          } else {
            location.reload();
          }
          return;
        }

        if (improvements && !this.improvementsStarted) {
          this.improvementsStarted = true;
          Sentry.addIntegration(Sentry.browserTracingIntegration());
          this.injector.get(Sentry.TraceService);
          void this.startFirebaseServices();
          void this.startSessionReplay();
        }
      });
    });
  }

  private async startFirebaseServices(): Promise<void> {
    try {
      const { Firebase } = await import('../firebase/firebase');
      this.injector.get(Firebase);
    } catch (error) {
      this.log.error('Firebase services initialization failed', error);
    }
  }

  private async startSessionReplay(): Promise<void> {
    try {
      const createReplayIntegration = await Sentry.lazyLoadIntegration('replayIntegration');
      const integration = createReplayIntegration({
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: true,
        networkDetailAllowUrls: [],
        networkCaptureBodies: false,
        networkRequestHeaders: [],
        networkResponseHeaders: [],
      });
      Sentry.addIntegration(integration);
      this.stopSessionReplay = () => (
        integration as typeof integration & {
          stop(options?: { flush?: boolean }): Promise<void>;
        }
      ).stop({ flush: false });
    } catch (error) {
      this.log.error('Session Replay initialization failed', error);
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