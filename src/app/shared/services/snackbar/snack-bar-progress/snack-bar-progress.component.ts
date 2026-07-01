import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatProgressBar } from '@angular/material/progress-bar';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

export interface SnackBarProgressData {
  message: string;
  time: string;
  duration: number;
}

@Component({
  selector: 'app-snack-bar-progress',
  templateUrl: './snack-bar-progress.component.html',
  styleUrls: ['./snack-bar-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressBar],
})
export class SnackBarProgressComponent {
  readonly data = inject<SnackBarProgressData>(MAT_SNACK_BAR_DATA);

  private readonly snackBarRef = inject<MatSnackBarRef<SnackBarProgressComponent>>(MatSnackBarRef);
  private readonly destroyRef = inject(DestroyRef);

  /** 0-100 progress value, drives the mat-progress-bar. */
  readonly progress = signal(100);

  constructor() {
    this.snackBarRef
      .afterOpened()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.runProgressBar(this.snackBarRef.containerInstance.snackBarConfig.duration ?? 0),
        error: (error) => console.error(error),
      });
  }

  private runProgressBar(duration: number) {
    this.progress.set(98);

    // step is expressed as a fraction of the total duration per tick.
    const step = 0.01;
    const tickMs = duration * step;

    if (!tickMs) {
      this.progress.set(0);
      return;
    }

    interval(tickMs)
      .pipe(
        takeWhile(() => this.progress() > 0),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.progress.update((value) => Math.max(0, value - 100 * step)));
  }
}