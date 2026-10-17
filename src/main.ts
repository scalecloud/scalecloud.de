import { ErrorHandler, inject, provideAppInitializer } from '@angular/core';
import * as Sentry from "@sentry/angular";
import {
  AbstractSecurityStorage,
  DefaultLocalStorageService,
  LogLevel,
  authInterceptor,
  provideAuth,
} from 'angular-auth-oidc-client';
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
import { Auth } from './app/core/auth/auth';

const authentikUrl = environment.oidc.authentikUrl;
const issuer = `${authentikUrl}/application/o/${environment.oidc.applicationSlug}/`;

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
    provideHttpClient(withInterceptors([authInterceptor(), serviceErrorInterceptor])),
    provideAuth({
      config: {
        authority: issuer,
        authWellknownEndpoints: {
          issuer,
          jwksUri: `${issuer}jwks/`,
          authorizationEndpoint: `${authentikUrl}/application/o/authorize/`,
          tokenEndpoint: `${authentikUrl}/application/o/token/`,
          userInfoEndpoint: `${authentikUrl}/application/o/userinfo/`,
          endSessionEndpoint: `${issuer}end-session/`,
          revocationEndpoint: `${authentikUrl}/application/o/revoke/`,
        },
        clientId: environment.oidc.clientId,
        redirectUrl: `${environment.appBaseUrl}/`,
        postLogoutRedirectUri: `${environment.appBaseUrl}/`,
        responseType: 'code',
        scope: 'openid profile email offline_access',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        ignoreNonceAfterRefresh: true,
        secureRoutes: [`${environment.apiUrl}/`],
        logLevel: environment.production ? LogLevel.Error : LogLevel.Warn,
      },
    }),
    { provide: AbstractSecurityStorage, useClass: DefaultLocalStorageService },
    CurrencyPipe,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({ showDialog: false }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    // Starts the auth check but does NOT wait for it (returns void), so the first render is never blocked.
    // Guards await the result themselves via Auth.ensureAuthenticated().
    provideAppInitializer(() => {
      void inject(Auth).init();
    }),
  ],
})
  .catch((err) => console.error(err));