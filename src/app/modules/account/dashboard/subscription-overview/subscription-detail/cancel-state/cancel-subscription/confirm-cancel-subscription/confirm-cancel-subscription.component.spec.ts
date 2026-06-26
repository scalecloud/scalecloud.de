import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { ConfirmCancelSubscriptionComponent } from './confirm-cancel-subscription.component';

const mockDialogRef = { close: vi.fn() };

describe('ConfirmCancelSubscriptionComponent', () => {
  let component: ConfirmCancelSubscriptionComponent;
  let fixture:   ComponentFixture<ConfirmCancelSubscriptionComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ConfirmCancelSubscriptionComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ConfirmCancelSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ───────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Content ────────────────────────────────────────────────────────────

  it('displays the confirmation question', () => {
    const paragraph = fixture.debugElement.query(By.css('mat-dialog-content p'));
    expect(paragraph.nativeElement.textContent.trim()).toBe(
      'Are you sure you want to cancel your subscription?'
    );
  });

  // ── Confirm button ─────────────────────────────────────────────────────

  describe('Cancel Subscription button', () => {
    it('closes the dialog with true when clicked', () => {
      const button = fixture.debugElement.query(By.css('[mat-dialog-close="true"]'));
      button.nativeElement.click();
      fixture.detectChanges();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('has the correct label', () => {
      const button = fixture.debugElement.query(By.css('[mat-dialog-close="true"]'));
      expect(button.nativeElement.textContent.trim()).toBe('Cancel Subscription');
    });
  });

  // ── Dismiss button ─────────────────────────────────────────────────────

  describe('Cancel button', () => {
    it('closes the dialog without a value when clicked', () => {
      const button = fixture.debugElement.query(By.css('[mat-dialog-close]:not([mat-dialog-close="true"])'));
      button.nativeElement.click();
      fixture.detectChanges();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('has the correct label', () => {
      const button = fixture.debugElement.query(By.css('[mat-dialog-close]:not([mat-dialog-close="true"])'));
      expect(button.nativeElement.textContent.trim()).toBe('Cancel');
    });
  });
});