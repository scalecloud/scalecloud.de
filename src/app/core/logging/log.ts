import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

type Attrs = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root'
})
export class Log {
  debug(message: string, attrs?: Attrs): void {
    Sentry.logger.debug(message, attrs);
  }

  log(message: string, attrs?: Attrs): void {
    Sentry.logger.info(message, attrs);
  }

  info(message: string, attrs?: Attrs): void {
    Sentry.logger.info(message, attrs);
  }

  warn(message: string, attrs?: Attrs): void {
    Sentry.logger.warn(message, attrs);
  }

  error(message: string, error?: unknown): void {
  Sentry.logger.error(message, error !== undefined ? { error: this.stringifyError(error) } : undefined);
  if (error !== undefined) {
    Sentry.captureException(error);
  }
}

private stringifyError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return Object.prototype.toString.call(error);
  }
}
}