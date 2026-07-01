import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackBarService } from './snack-bar.service';
import { SnackBarProgressComponent } from './snack-bar-progress/snack-bar-progress.component';
import { LogService } from '../log/log.service';

describe('SnackBarService', () => {
  let service: SnackBarService;

  const matSnackBar = { openFromComponent: vi.fn() };
  const logService = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 5, 3));

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: LogService, useValue: logService },
      ],
    });

    service = TestBed.inject(SnackBarService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open an info snackbar with the default duration', () => {
    service.info('Hello');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgressComponent,
      expect.objectContaining({
        duration: 8000,
        panelClass: ['snackbar-info'],
        data: { message: 'Hello', time: '09:05:03', duration: 8 },
      }),
    );
    expect(logService.info).toHaveBeenCalledWith('Hello');
  });

  it('should open an info snackbar with a custom duration', () => {
    service.infoDuration('Hello', 3);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgressComponent,
      expect.objectContaining({ duration: 3000, panelClass: ['snackbar-info'] }),
    );
  });

  it('should open a warn snackbar with the default duration', () => {
    service.warn('Careful');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgressComponent,
      expect.objectContaining({ duration: 8000, panelClass: ['snackbar-warn'] }),
    );
    expect(logService.warn).toHaveBeenCalledWith('Careful');
  });

  it('should open a warn snackbar with a custom duration', () => {
    service.warnDuration('Careful', 5);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgressComponent,
      expect.objectContaining({ duration: 5000, panelClass: ['snackbar-warn'] }),
    );
  });

  it('should open an error snackbar with the default duration', () => {
    service.error('Broken');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgressComponent,
      expect.objectContaining({ duration: 8000, panelClass: ['snackbar-error'] }),
    );
    expect(logService.error).toHaveBeenCalledWith('Broken');
  });

  it('should open an error snackbar with a custom duration', () => {
    service.errorDuration('Broken', 12);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgressComponent,
      expect.objectContaining({ duration: 12000, panelClass: ['snackbar-error'] }),
    );
  });

  it('should format the current time as HH:MM:SS in the snackbar data', () => {
    vi.setSystemTime(new Date(2026, 0, 1, 0, 4, 9));

    service.info('Midnight message');

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      SnackBarProgressComponent,
      expect.objectContaining({ data: expect.objectContaining({ time: '00:04:09' }) }),
    );
  });
});