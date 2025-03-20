import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { EnvironmentService } from './app/shared/services/environment/environment.service';

// Manually create an instance of the EnvironmentService
const environmentService = new EnvironmentService();
const sentryEnvironment = environmentService.getEnvironment();

Sentry.init({
  dsn: 'https://37ae26106eaa1531ba2941ee13b103c5@o4508966853083136.ingest.de.sentry.io/4508971996872784',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  environment: sentryEnvironment,
  // Tracing
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', /^https:\/\/api\.scalecloud\.de/],
  // Session Replay
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));