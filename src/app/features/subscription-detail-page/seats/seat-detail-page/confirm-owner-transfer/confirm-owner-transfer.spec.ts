import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { ConfirmOwnerTransfer } from './confirm-owner-transfer';

describe('ConfirmOwnerTransfer', () => {
  let component: ConfirmOwnerTransfer;
  let fixture: ComponentFixture<ConfirmOwnerTransfer>;

  const dialogRefMock = { close: vi.fn() };
  const dialogData = { email: 'target@example.com' };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule,
        NoopAnimationsModule,
        ConfirmOwnerTransfer,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmOwnerTransfer);
    component = fixture.componentInstance;
    await fixture.whenStable();
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