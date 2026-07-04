import { Injectable } from '@angular/core';
import { Logger } from '@firebase/logger';
import { captureMessage, captureException } from '@sentry/angular';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private readonly logger = new Logger('Logger');

  debug(message: string): void {
    this.logger.debug(message);
    captureMessage(message, 'debug');
  }

  log(message: string): void {
    this.logger.log(message);
    captureMessage(message, 'log');
  }

  info(message: string): void {
    this.logger.info(message);
    captureMessage(message, 'info');
  }

  warn(message: string): void {
    this.logger.warn(message);
    captureMessage(message, 'warning');
  }

  error(message: string, error?: Error | unknown): void {
    this.logger.error(message);
    if (error) {
      captureException(error);
    } else {
      captureMessage(message, 'error');
    }
  }
}