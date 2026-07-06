import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { ISubscriptionResumeReply } from './subscription-resume';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { ResumeSubscription } from './resume-subscription';
import { ResumeSubscriptionClient } from './resume-subscription-client';

const SUBSCRIPTION_ID = 'sub_123';

const makeReply = (cancel_at_period_end: boolean): ISubscriptionResumeReply => ({
  subscriptionID: SUBSCRIPTION_ID,
  cancel_at_period_end,
});

describe('ResumeSubscription', () => {
  let component: ResumeSubscription;
  let fixture: ComponentFixture<ResumeSubscription>;

  let dialog: { open: ReturnType<typeof vi.fn> };
  let resumeSubscriptionClient: { resumeSubscription: ReturnType<typeof vi.fn> };
  let log: { error: ReturnType<typeof vi.fn> };
  let snackBar: { info: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dialog = { open: vi.fn() };
    resumeSubscriptionClient = { resumeSubscription: vi.fn() };
    log = { error: vi.fn() };
    snackBar = { info: vi.fn(), error: vi.fn() };

    TestBed.configureTestingModule({
      imports: [ResumeSubscription],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: ResumeSubscriptionClient, useValue: resumeSubscriptionClient },
        { provide: Log, useValue: log },
        { provide: SnackBar, useValue: snackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: vi.fn().mockReturnValue(SUBSCRIPTION_ID) } },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ResumeSubscription);
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
      resumeSubscriptionClient.resumeSubscription.mockReturnValue(of(makeReply(false)));

      component.openConfirmDialog();

      expect(resumeSubscriptionClient.resumeSubscription).toHaveBeenCalledWith({
        subscriptionID: SUBSCRIPTION_ID,
      });
    });

    it('does NOT call resumeSubscription when the dialog is dismissed', () => {
      dialog.open.mockReturnValue({
        afterClosed: () => of(false),
      } as Partial<MatDialogRef<unknown>>);

      component.openConfirmDialog();

      expect(resumeSubscriptionClient.resumeSubscription).not.toHaveBeenCalled();
    });

    it('does NOT call resumeSubscription when the dialog is closed without a value', () => {
      dialog.open.mockReturnValue({
        afterClosed: () => of(undefined),
      } as Partial<MatDialogRef<unknown>>);

      component.openConfirmDialog();

      expect(resumeSubscriptionClient.resumeSubscription).not.toHaveBeenCalled();
    });
  });

  describe('resumeSubscription()', () => {
    it('shows success snackbar and emits reloadSubscriptionDetail when resumed', () => {
      resumeSubscriptionClient.resumeSubscription.mockReturnValue(of(makeReply(false)));
      const emitSpy = vi.spyOn(component.reloadSubscriptionDetail, 'emit');

      component.resumeSubscription();

      expect(snackBar.info).toHaveBeenCalledWith('Your Subscription has been resumed.');
      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('shows error snackbar and does NOT emit when cancelAtPeriodEnd is true', () => {
      resumeSubscriptionClient.resumeSubscription.mockReturnValue(of(makeReply(true)));
      const emitSpy = vi.spyOn(component.reloadSubscriptionDetail, 'emit');

      component.resumeSubscription();

      expect(snackBar.error).toHaveBeenCalledWith('Your Subscription is still canceled.');
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('logs an error when subscriptionID is missing from route', () => {
      TestBed.inject(ActivatedRoute).snapshot.paramMap.get = vi.fn().mockReturnValue(null);

      component.resumeSubscription();

      expect(log.error).toHaveBeenCalledWith(
        'ResumeSubscriptionComponent.resumeSubscription: id is null',
      );
      expect(resumeSubscriptionClient.resumeSubscription).not.toHaveBeenCalled();
    });

    it('logs an error when the service reply is null', () => {
      resumeSubscriptionClient.resumeSubscription.mockReturnValue(of(null));

      component.resumeSubscription();

      expect(log.error).toHaveBeenCalledWith(
        'ResumeSubscriptionComponent.resumeSubscription: reply is null',
      );
    });
  });
});