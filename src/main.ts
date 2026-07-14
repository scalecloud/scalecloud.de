import { ErrorHandler, inject, provideAppInitializer } from '@angular/core';
import * as Sentry from "@sentry/angular";
import { environment } from './environments/environment';
import { CurrencyPipe } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { serviceErrorInterceptor } from './app/core/interceptor/service-error-interceptor';
import { API_URL, APP_BASE_URL } from './app/core/config/api-token';
import { STRIPE_PUBLIC_KEY } from './app/core/stripe/stripe-key';

Sentry.init({
  dsn: "https://37ae26106eaa1531ba2941ee13b103c5@o4508966853083136.ingest.de.sentry.io/4508971996872784",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
  ],
  environment: environment.production ? 'production' : 'development',
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/api\.scalecloud\.de/],
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

bootstrapApplication(App, {
  providers: [
    {
      provide: APP_BASE_URL,
      useValue: environment.appBaseUrl,
    },
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    {
      provide: STRIPE_PUBLIC_KEY,
      useValue: environment.stripePublicKey,
    },
    provideRouter(routes),
    provideHttpClient(withInterceptors([serviceErrorInterceptor])),
    CurrencyPipe,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({ showDialog: false }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    provideAppInitializer(() => {
      inject(Sentry.TraceService);
    }),
  ],
})
  .catch((err) => console.error(err));