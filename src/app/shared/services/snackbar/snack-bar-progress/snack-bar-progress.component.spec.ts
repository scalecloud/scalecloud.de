import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Subject } from 'rxjs';

import { SnackBarProgressComponent, SnackBarProgressData } from './snack-bar-progress.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

describe('SnackBarProgressComponent', () => {
  let component: SnackBarProgressComponent;
  let fixture: ComponentFixture<SnackBarProgressComponent>;
  let afterOpened$: Subject<void>;

  const data: SnackBarProgressData = { message: 'Saved', time: '09:00:00', duration: 5 };

  const snackBarRef = {
    afterOpened: () => afterOpened$.asObservable(),
    containerInstance: { snackBarConfig: { duration: 5000 } },
  };

  beforeEach(async () => {
    afterOpened$ = new Subject<void>();
    snackBarRef.containerInstance.snackBarConfig.duration = 5000;

    await TestBed.configureTestingModule({
      imports: [SnackBarProgressComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MAT_SNACK_BAR_DATA, useValue: data },
        { provide: MatSnackBarRef, useValue: snackBarRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackBarProgressComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the injected snackbar data', () => {
    expect(component.data).toEqual(data);
  });

  it('should start at progress 100 before the snackbar has opened', () => {
    expect(component.progress()).toBe(100);
  });

  it('should drop to 98 as soon as the snackbar opens', async () => {
    afterOpened$.next();
    await fixture.whenStable();

    expect(component.progress()).toBe(98);
  });

  it('should decrease progress over time based on the configured duration', async () => {
    vi.useFakeTimers();
    afterOpened$.next();

    const initial = component.progress();
    await vi.advanceTimersByTimeAsync(500);

    expect(component.progress()).toBeLessThan(initial);
  });

  it('should never drop below 0', async () => {
    vi.useFakeTimers();
    afterOpened$.next();

    await vi.advanceTimersByTimeAsync(60_000);

    expect(component.progress()).toBe(0);
  });

  it('should log an error if the afterOpened stream errors', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    afterOpened$.error(new Error('boom'));

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should stop updating progress once the component is destroyed', async () => {
    vi.useFakeTimers();
    afterOpened$.next();
    await vi.advanceTimersByTimeAsync(100);

    const progressBeforeDestroy = component.progress();
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(5_000);

    expect(component.progress()).toBe(progressBeforeDestroy);
  });

  it('should handle a zero duration by dropping straight to 0', async () => {
    snackBarRef.containerInstance.snackBarConfig.duration = 0;
    fixture = TestBed.createComponent(SnackBarProgressComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    afterOpened$.next();
    await fixture.whenStable();

    expect(component.progress()).toBe(0);
  });
});