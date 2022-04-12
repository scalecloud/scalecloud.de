import { Injectable } from '@angular/core';
import { Logger } from '@firebase/logger';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logger: Logger;

  constructor() {
    this.logger = new Logger(`Logger`);
  }

  debug(message: string): void {
    this.logger.debug(message)
  }

  log(message: string): void {
    this.logger.log(message)
  }

  info(message: string): void {
    this.logger.info(message)
  }

  warn(message: string): void {
    this.logger.warn(message)
  }

  error(message: string): void {
    this.logger.error(message)
  }

}
