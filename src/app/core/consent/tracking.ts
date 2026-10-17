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
      // Dedupe removes duplicate errors; event filters drop known low-value errors.
      integrations: [
        Sentry.globalHandlersIntegration(),
        Sentry.dedupeIntegration(),
        Sentry.eventFiltersIntegration(),
      ],
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        graphQL: { document: false, variables: false },
        genAI: { inputs: false, outputs: false },
        databaseQueryData: false,
        queues: false,
        stackFrameVariables: false,
        frameContextLines: 0,
      },
      tracesSampleRate: 0.2,
      tracePropagationTargets: ['localhost', /^https:\/\/api\.scalecloud\.de/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 0.1,
      beforeSendMetric: () => null,
      beforeSendLog: (log) => {
        if (log.attributes) {
          for (const key of Object.keys(log.attributes)) {
            if (/(email|user|token|secret|password|url|return|code|auth|cookie|(?:^|[_-])id(?:$|[_-]))/i.test(key)) {
              delete log.attributes[key];
            }
          }
        }
        return log;
      },
      beforeSendSpan: (span) => {
        const attributes = { ...span.attributes };
        for (const key of Object.keys(attributes)) {
          if (/(url|query|cookie|header|user|email|session|token|secret|target|route|address)/i.test(key)) {
            delete attributes[key];
          }
        }
        span.attributes = attributes;
        span.name = span.is_segment ? 'page navigation' : 'browser operation';
        delete span.links;
        return span;
      },
      beforeSend: (event) => {
        delete event.user;
        delete event.request;
        delete event.breadcrumbs;
        delete event.contexts;
        delete event.extra;
        delete event.tags;
        delete event.transaction;
        delete event.message;
        delete event.logentry;
        delete event.fingerprint;

        for (const exception of event.exception?.values ?? []) {
          delete exception.mechanism;
          if (exception.stacktrace?.frames) {
            exception.stacktrace.frames = exception.stacktrace.frames.map((frame) => {
              const safeFrame = { ...frame };
              delete safeFrame.vars;
              delete safeFrame.context_line;
              delete safeFrame.pre_context;
              delete safeFrame.post_context;
              if (safeFrame.abs_path) {
                safeFrame.abs_path = safeFrame.abs_path.split(/[?#]/)[0];
              }
              if (safeFrame.filename) {
                safeFrame.filename = safeFrame.filename.split(/[?#]/)[0];
              }
              return safeFrame;
            });
          }
        }

        return event;
      },
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
          void this.startAnalytics();
          void this.startSessionReplay();
        }
      });
    });
  }

  private async startAnalytics(): Promise<void> {
    try {
      const { Firebase } = await import('../firebase/firebase');
      this.injector.get(Firebase);
    } catch (error) {
      this.log.error('Analytics initialization failed', error);
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