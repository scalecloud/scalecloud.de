import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-progress',
  templateUrl: './snack-bar-progress.component.html',
  styleUrls: ['./snack-bar-progress.component.scss']
})
export class SnackBarProgressComponent implements OnInit {
  progress = 100;
  private currentIntervalId: any;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<SnackBarProgressComponent>
  ) {}

  ngOnInit() {
    this.snackBarRef.afterOpened().subscribe(
      () => {
        const duration = this.snackBarRef.containerInstance.snackBarConfig.duration;
        this.runProgressBar(duration);
      },
      error => console.error(error)
    );
  }

  runProgressBar(duration: number) {
    this.progress = 98;
    const step = 0.010;
    this.cleanProgressBarInterval();
    this.currentIntervalId = setInterval(() => {
      this.progress -= 100 * step;
      if (this.progress < 0) {
        this.cleanProgressBarInterval();
      }
    }, duration * step);
  }

  cleanProgressBarInterval() {
    clearInterval(this.currentIntervalId);
  }
}