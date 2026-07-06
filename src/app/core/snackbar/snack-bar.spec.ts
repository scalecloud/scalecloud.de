import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackBar } from './snack-bar';
import { SnackBarProgress } from './progress/snack-bar-progress';
import { Log } from '../logging/log';

describe('SnackBar', () => {
  let snackBar: SnackBar;

  const matSnackBar = { openFromComponent: vi.fn() };
  const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 5, 3));

    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: Log, useValue: log },
      ],
    });

    snackBar = TestBed.inject(SnackBar);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(snackBar).toBeTruthy();
  });

  it('should open an info snackbar with the default duration', () => {
    snackBar.info('Hello');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgress,
      expect.objectContaining({
        duration: 8000,
        panelClass: ['snackbar-info'],
        data: { message: 'Hello', time: '09:05:03', duration: 8 },
      }),
    );
    expect(log.info).toHaveBeenCalledWith('Hello');
  });

  it('should open an info snackbar with a custom duration', () => {
    snackBar.infoDuration('Hello', 3);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgress,
      expect.objectContaining({ duration: 3000, panelClass: ['snackbar-info'] }),
    );
  });

  it('should open a warn snackbar with the default duration', () => {
    snackBar.warn('Careful');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgress,
      expect.objectContaining({ duration: 8000, panelClass: ['snackbar-warn'] }),
    );
    expect(log.warn).toHaveBeenCalledWith('Careful');
  });

  it('should open a warn snackbar with a custom duration', () => {
    snackBar.warnDuration('Careful', 5);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgress,
      expect.objectContaining({ duration: 5000, panelClass: ['snackbar-warn'] }),
    );
  });

  it('should open an error snackbar with the default duration', () => {
    snackBar.error('Broken');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgress,
      expect.objectContaining({ duration: 8000, panelClass: ['snackbar-error'] }),
    );
    expect(log.error).toHaveBeenCalledWith('Broken');
  });

  it('should open an error snackbar with a custom duration', () => {
    snackBar.errorDuration('Broken', 12);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgress,
      expect.objectContaining({ duration: 12000, panelClass: ['snackbar-error'] }),
    );
  });

  it('should format the current time as HH:MM:SS in the snackbar data', () => {
    vi.setSystemTime(new Date(2026, 0, 1, 0, 4, 9));

    snackBar.info('Midnight message');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgress,
      expect.objectContaining({ data: expect.objectContaining({ time: '00:04:09' }) }),
    );
  });
});