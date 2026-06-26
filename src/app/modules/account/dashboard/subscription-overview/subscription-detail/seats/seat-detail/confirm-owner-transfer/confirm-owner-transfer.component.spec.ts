import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmOwnerTransferComponent } from './confirm-owner-transfer.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('ConfirmOwnerTransferComponent', () => {
  let component: ConfirmOwnerTransferComponent;
  let fixture: ComponentFixture<ConfirmOwnerTransferComponent>;
  const dialogRefMock = { close: vi.fn() };
  const dialogData = { email: 'test@example.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MatDialogModule, MatButtonModule, NoopAnimationsModule, ConfirmOwnerTransferComponent],
    providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
    ]
}).compileComponents();

    fixture = TestBed.createComponent(ConfirmOwnerTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on no click', () => {
    component.onNoClick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
