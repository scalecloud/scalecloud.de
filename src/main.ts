import { enableProdMode, provideZoneChangeDetection, ErrorHandler, APP_BOOTSTRAP_LISTENER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from "@sentry/angular";


import { environment } from './environments/environment';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

Sentry.init({
  dsn: "https://37ae26106eaa1531ba2941ee13b103c5@o4508966853083136.ingest.de.sentry.io/4508971996872784",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  environment: environment.production ? 'production' : 'development',
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/api\.scalecloud\.de/],
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, BrowserAnimationsModule),
        CurrencyPipe,
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({ showDialog: false }),
        },
        {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        {
            provide: APP_BOOTSTRAP_LISTENER,
            useFactory: (traceService: Sentry.TraceService) => () => { },
            deps: [Sentry.TraceService],
            multi: true,
        }
    ]
})
  .catch((err) => console.error(err));