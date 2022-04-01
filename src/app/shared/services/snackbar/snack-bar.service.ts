import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private durationInSeconds = 5;

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone
  ) { }

  info(message: string) {
    this.showMessage(message, 'snackbar-info');
  }

  warn(message: string) {
    this.showMessage(message, 'snackbar-warn');
  }

  error(message: string) {
    this.showMessage(message, 'snackbar-error');
  }

  private showMessage(message: string, cssClass: string) {
    this.zone.run(() => {
      this.snackBar.open(message, '', {
        duration: this.durationInSeconds * 1000,
        panelClass: [cssClass]
      });
    });
  }
}