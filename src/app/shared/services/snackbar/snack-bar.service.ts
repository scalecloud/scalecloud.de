import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '../log/log.service';
import { SnackBarProgressComponent } from './snack-bar-progress/snack-bar-progress.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private defaultDuration = 8;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly zone: NgZone,
    private readonly logService: LogService
  ) { }

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

  private showMessage(message: string, duration: number, cssClass: string) {
    let date = new Date();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    let time = `${hours}:${minutes}:${seconds}`;
    this.zone.run(() => {
      this.snackBar.openFromComponent(SnackBarProgressComponent, {
        duration: duration * 1000,
        panelClass: [cssClass],
        data: { message, time, duration }
      });
    });
  }
}