import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { ConfirmOwnerTransferComponent } from './confirm-owner-transfer.component';

describe('ConfirmOwnerTransferComponent', () => {
  let component: ConfirmOwnerTransferComponent;
  let fixture: ComponentFixture<ConfirmOwnerTransferComponent>;
  const dialogRefMock = { close: vi.fn() };
  const dialogData = { email: 'target@example.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule,
        NoopAnimationsModule,
        ConfirmOwnerTransferComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmOwnerTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes injected dialog data', () => {
    expect(component.data.email).toBe('target@example.com');
  });

  it('onNoClick closes the dialog with false', () => {
    component.onNoClick();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('onNoClick only closes once per call', () => {
    component.onNoClick();
    expect(dialogRefMock.close).toHaveBeenCalledTimes(1);
  });
});