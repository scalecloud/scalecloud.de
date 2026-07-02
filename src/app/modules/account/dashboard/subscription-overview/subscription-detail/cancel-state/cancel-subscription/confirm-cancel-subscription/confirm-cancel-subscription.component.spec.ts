import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
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
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ConfirmCancelSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
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
    it('closes the dialog with true when clicked', async () => {
      const button = fixture.debugElement.query(By.css('[data-testid="confirm-cancel-btn"]'));
      button.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('has the correct label', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="confirm-cancel-btn"]'));
      expect(button.nativeElement.textContent.trim()).toBe('Cancel Subscription');
    });
  });

  // ── Dismiss button ─────────────────────────────────────────────────────

  describe('Cancel button', () => {
    it('closes the dialog without a value when clicked', async () => {
      const button = fixture.debugElement.query(By.css('[data-testid="dismiss-btn"]'));
      button.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('has the correct label', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="dismiss-btn"]'));
      expect(button.nativeElement.textContent.trim()).toBe('Cancel');
    });
  });
});