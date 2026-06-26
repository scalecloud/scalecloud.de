import { ApplicationConfig } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URL } from './api.token';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
  ],
};