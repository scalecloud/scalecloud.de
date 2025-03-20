import { Injectable } from '@angular/core';
import { Environment } from './environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  constructor() {}

  getEnvironment(): Environment {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      return Environment.Development;
    } else if (hostname === 'beta.scalecloud.de') {
      return Environment.Testing;
    } else if (hostname === 'www.scalecloud.de') {
      return Environment.Production;
    } else {
      console.error('Unknown environment: ' + hostname);
      return Environment.Unknown;
    }
  }
}
