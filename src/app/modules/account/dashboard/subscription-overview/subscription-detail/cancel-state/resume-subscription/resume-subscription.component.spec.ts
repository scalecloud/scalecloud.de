import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { ResumeSubscriptionComponent } from './resume-subscription.component';
import { ResumeSubscriptionService } from './resume-subscription.service';
import { ISubscriptionResumeReply } from './subscription-resume';

const SUBSCRIPTION_ID = 'sub_123';

const makeReply = (cancel_at_period_end: boolean): ISubscriptionResumeReply => ({
  subscriptionID: SUBSCRIPTION_ID,
  cancel_at_period_end,
});

describe('ResumeSubscriptionComponent', () => {
  let component: ResumeSubscriptionComponent;
  let fixture: ComponentFixture<ResumeSubscriptionComponent>;

  let dialog: { open: ReturnType<typeof vi.fn> };
  let resumeSubscriptionService: { resumeSubscription: ReturnType<typeof vi.fn> };
  let logService: { error: ReturnType<typeof vi.fn> };
  let snackBarService: { info: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dialog = { open: vi.fn() };
    resumeSubscriptionService = { resumeSubscription: vi.fn() };
    logService = { error: vi.fn() };
    snackBarService = { info: vi.fn(), error: vi.fn() };

    TestBed.configureTestingModule({
      imports: [ResumeSubscriptionComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialog, useValue: dialog },
        { provide: ResumeSubscriptionService, useValue: resumeSubscriptionService },
        { provide: LogService, useValue: logService },
        { provide: SnackBarService, useValue: snackBarService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn().mockReturnValue(SUBSCRIPTION_ID) } },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ResumeSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openConfirmDialog()', () => {
    it('calls resumeSubscription when the dialog confirms', () => {
      dialog.open.mockReturnValue({
        afterClosed: () => of(true),
      } as Partial<MatDialogRef<unknown>>);
      resumeSubscriptionService.resumeSubscription.mockReturnValue(of(makeReply(false)));

      component.openConfirmDialog();

      expect(resumeSubscriptionService.resumeSubscription).toHaveBeenCalledWith({
        subscriptionID: SUBSCRIPTION_ID,
      });
    });

    it('does NOT call resumeSubscription when the dialog is dismissed', () => {
      dialog.open.mockReturnValue({
        afterClosed: () => of(false),
      } as Partial<MatDialogRef<unknown>>);

      component.openConfirmDialog();

      expect(resumeSubscriptionService.resumeSubscription).not.toHaveBeenCalled();
    });

    it('does NOT call resumeSubscription when the dialog is closed without a value', () => {
      dialog.open.mockReturnValue({
        afterClosed: () => of(undefined),
      } as Partial<MatDialogRef<unknown>>);

      component.openConfirmDialog();

      expect(resumeSubscriptionService.resumeSubscription).not.toHaveBeenCalled();
    });
  });

  describe('resumeSubscription()', () => {
    it('shows success snackbar and emits reloadSubscriptionDetail when resumed', () => {
      resumeSubscriptionService.resumeSubscription.mockReturnValue(of(makeReply(false)));
      const emitSpy = vi.spyOn(component.reloadSubscriptionDetail, 'emit');

      component.resumeSubscription();

      expect(snackBarService.info).toHaveBeenCalledWith('Your Subscription has been resumed.');
      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('shows error snackbar and does NOT emit when cancelAtPeriodEnd is true', () => {
      resumeSubscriptionService.resumeSubscription.mockReturnValue(of(makeReply(true)));
      const emitSpy = vi.spyOn(component.reloadSubscriptionDetail, 'emit');

      component.resumeSubscription();

      expect(snackBarService.error).toHaveBeenCalledWith('Your Subscription is still canceled.');
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('logs an error when subscriptionID is missing from route', () => {
      TestBed.inject(ActivatedRoute).snapshot.paramMap.get = vi.fn().mockReturnValue(null);

      component.resumeSubscription();

      expect(logService.error).toHaveBeenCalledWith(
        'ResumeSubscriptionComponent.resumeSubscription: id is null',
      );
      expect(resumeSubscriptionService.resumeSubscription).not.toHaveBeenCalled();
    });

    it('logs an error when the service reply is null', () => {
      resumeSubscriptionService.resumeSubscription.mockReturnValue(of(null));

      component.resumeSubscription();

      expect(logService.error).toHaveBeenCalledWith(
        'ResumeSubscriptionComponent.resumeSubscription: reply is null',
      );
    });
  });
});