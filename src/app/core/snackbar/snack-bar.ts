import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Log } from '../logging/log';
import { SnackBarProgress, SnackBarProgressData } from './progress/snack-bar-progress';

type SnackBarCssClass = 'snackbar-info' | 'snackbar-warn' | 'snackbar-error';

@Injectable({
  providedIn: 'root',
})
export class SnackBar {
  private readonly snackBar = inject(MatSnackBar);
  private readonly log = inject(Log);

  private readonly defaultDuration = 8;

  info(message: string) {
    this.infoDuration(message, this.defaultDuration);
  }

  infoDuration(message: string, duration: number) {
    this.showMessage(message, duration, 'snackbar-info');
    this.log.info(message);
  }

  warn(message: string) {
    this.warnDuration(message, this.defaultDuration);
  }

  warnDuration(message: string, duration: number) {
    this.showMessage(message, duration, 'snackbar-warn');
    this.log.warn(message);
  }

  error(message: string) {
    this.errorDuration(message, this.defaultDuration);
  }

  errorDuration(message: string, duration: number) {
    this.showMessage(message, duration, 'snackbar-error');
    this.log.error(message);
  }

  private showMessage(message: string, duration: number, cssClass: SnackBarCssClass) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    const data: SnackBarProgressData = { message, time, duration };

    this.snackBar.openFromComponent(SnackBarProgress, {
      duration: duration * 1000,
      panelClass: [cssClass],
      data,
    });
  }
}