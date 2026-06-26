import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
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
  data = inject(MAT_SNACK_BAR_DATA);
  private readonly snackBarRef = inject<MatSnackBarRef<SnackBarProgressComponent>>(MatSnackBarRef);

  progress = 100;
  private currentIntervalId: any;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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