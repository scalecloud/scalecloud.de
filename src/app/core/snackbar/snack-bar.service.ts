import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Log } from '../logging/log';
import { SnackBarProgressComponent, SnackBarProgressData } from './progress/snack-bar-progress.component';

type SnackBarCssClass = 'snackbar-info' | 'snackbar-warn' | 'snackbar-error';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly logService = inject(Log);

  private readonly defaultDuration = 8;

  info(message: string) {
    this.infoDuration(message, this.defaultDuration);
  }

  infoDuration(message: string, duration: number) {
    this.showMessage(message, duration, 'snackbar-info');
    this.logService.info(message);
  }

  warn(message: string) {
    this.warnDuration(message, this.defaultDuration);
  }

  warnDuration(message: string, duration: number) {
    this.showMessage(message, duration, 'snackbar-warn');
    this.logService.warn(message);
  }

  error(message: string) {
    this.errorDuration(message, this.defaultDuration);
  }

  errorDuration(message: string, duration: number) {
    this.showMessage(message, duration, 'snackbar-error');
    this.logService.error(message);
  }

  private showMessage(message: string, duration: number, cssClass: SnackBarCssClass) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    const data: SnackBarProgressData = { message, time, duration };

    this.snackBar.openFromComponent(SnackBarProgressComponent, {
      duration: duration * 1000,
      panelClass: [cssClass],
      data,
    });
  }
}