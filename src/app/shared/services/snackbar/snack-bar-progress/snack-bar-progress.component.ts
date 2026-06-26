import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'app-snack-bar-progress',
    templateUrl: './snack-bar-progress.component.html',
    styleUrls: ['./snack-bar-progress.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatProgressBar]
})
export class SnackBarProgressComponent implements OnInit {
  progress = 100;
  private currentIntervalId: any;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private readonly snackBarRef: MatSnackBarRef<SnackBarProgressComponent>
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