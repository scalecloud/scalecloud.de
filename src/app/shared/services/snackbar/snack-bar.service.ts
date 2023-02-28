import { Injectable, NgZone } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { LogService } from '../log/log.service';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private defaultDuration = 8;

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone,
    private logService: LogService
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
    let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    this.zone.run(() => {
      this.snackBar.open(message + " - " + time, '', {
        duration: duration * 1000,
        panelClass: [cssClass]
      });
    });
  }
}