import { Injectable } from '@angular/core';
import { Logger } from '@firebase/logger';
import * as Sentry from "@sentry/angular";
import { SeverityLevel } from '@sentry/types';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logger: Logger;

  constructor() {
    this.logger = new Logger(`Logger`);
  }

  debug(message: string): void {
    this.logger.debug(message);
    Sentry.captureMessage(message, 'debug' as SeverityLevel);
  }

  log(message: string): void {
    this.logger.log(message);
    Sentry.captureMessage(message, 'log' as SeverityLevel);
  }

  info(message: string): void {
    this.logger.info(message);
    Sentry.captureMessage(message, 'info' as SeverityLevel);
  }

  warn(message: string): void {
    this.logger.warn(message);
    Sentry.captureMessage(message, 'warning' as SeverityLevel);
  }

  error(message: string): void {
    this.logger.error(message);
    Sentry.captureException(new Error(message));
  }
}
