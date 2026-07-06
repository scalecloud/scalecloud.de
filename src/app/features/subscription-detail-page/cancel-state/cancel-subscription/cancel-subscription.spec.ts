import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { of, Subject } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { ISubscriptionCancelReply } from './subscription-cancel-request';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { CancelSubscription } from './cancel-subscription';
import { CancelSubscriptionClient } from './cancel-subscription-client';

// ── Stubs ─────────────────────────────────────────────────────────────────────

@Component({ selector: 'app-confirm-cancel-subscription', template: '', standalone: true })
class ConfirmCancelSubscriptionStub {}

// ── Mocks ─────────────────────────────────────────────────────────────────────

const SUBSCRIPTION_ID = 'sub-abc-123';

const mockActivatedRoute = {
  snapshot: { paramMap: { get: vi.fn().mockReturnValue(SUBSCRIPTION_ID) } },
};

const mockAuth            = { waitForAuth: vi.fn().mockResolvedValue(void 0) };
const mockLog             = { error: vi.fn(), info: vi.fn() };
const mockSnackBar        = { info: vi.fn(), error: vi.fn() };
const mockCancelSubscriptionClient = {
  cancelSubscription: vi.fn(),
};

const MOCK_REPLY: ISubscriptionCancelReply = {
  subscriptionID:       SUBSCRIPTION_ID,
  cancel_at_period_end: true,
  cancel_at:            1893456000, // 2030-01-01
};

// DialogRef subject lets us control when afterClosed() emits
let afterClosedSubject: Subject<boolean>;
const mockDialogRef = {
  afterClosed: vi.fn(),
};
const mockDialog = {
  open: vi.fn().mockReturnValue(mockDialogRef),
};

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('CancelSubscription', () => {
  let component: CancelSubscription;
  let fixture:   ComponentFixture<CancelSubscription>;

  beforeEach(async () => {
    vi.clearAllMocks();

    afterClosedSubject = new Subject<boolean>();
    mockDialogRef.afterClosed.mockReturnValue(afterClosedSubject.asObservable());
    mockCancelSubscriptionClient.cancelSubscription.mockReturnValue(of(MOCK_REPLY));

    await TestBed.configureTestingModule({
      imports: [CancelSubscription],
      providers: [
        { provide: ActivatedRoute,             useValue: mockActivatedRoute },
        { provide: Auth,                useValue: mockAuth },
        { provide: CancelSubscriptionClient,  useValue: mockCancelSubscriptionClient },
        { provide: Log,                 useValue: mockLog },
        { provide: SnackBar,            useValue: mockSnackBar },
        { provide: MatDialog,                  useValue: mockDialog },
      ],
    })
    .compileComponents();

    fixture   = TestBed.createComponent(CancelSubscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ───────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── openConfirmDialog ──────────────────────────────────────────────────

  describe('openConfirmDialog', () => {
    it('opens the confirm dialog', () => {
      component.openConfirmDialog();
      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('calls cancelSubscription when the dialog confirms', () => {
      const spy = vi.spyOn(component, 'cancelSubscription');
      component.openConfirmDialog();
      afterClosedSubject.next(true);
      expect(spy).toHaveBeenCalled();
    });

    it('does not call cancelSubscription when the dialog is dismissed', () => {
      const spy = vi.spyOn(component, 'cancelSubscription');
      component.openConfirmDialog();
      afterClosedSubject.next(false);
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not call cancelSubscription when the dialog is closed without a value', () => {
      const spy = vi.spyOn(component, 'cancelSubscription');
      component.openConfirmDialog();
      afterClosedSubject.next(undefined as any);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── cancelSubscription ─────────────────────────────────────────────────

  describe('cancelSubscription', () => {
    it('calls the service with the correct subscriptionID', () => {
      component.cancelSubscription();
      expect(mockCancelSubscriptionClient.cancelSubscription).toHaveBeenCalledWith({
        subscriptionID: SUBSCRIPTION_ID,
      });
    });

    it('shows a snackbar with the cancellation date on success', () => {
      component.cancelSubscription();
      expect(mockSnackBar.info).toHaveBeenCalledWith(
        expect.stringContaining('Your Subscription will cancel at:')
      );
    });

    it('emits reloadSubscriptionDetail on success', () => {
      const spy = vi.spyOn(component.reloadSubscriptionDetail, 'emit');
      component.cancelSubscription();
      expect(spy).toHaveBeenCalled();
    });

    it('does not emit or show snackbar when cancel_at_period_end is false', () => {
      const replyNotEnding: ISubscriptionCancelReply = {
        ...MOCK_REPLY,
        cancel_at_period_end: false,
      };
      mockCancelSubscriptionClient.cancelSubscription.mockReturnValueOnce(of(replyNotEnding));
      const spy = vi.spyOn(component.reloadSubscriptionDetail, 'emit');

      component.cancelSubscription();

      expect(mockSnackBar.info).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('logs an error when subscriptionID is missing', () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValueOnce(null);
      component.cancelSubscription();
      expect(mockLog.error).toHaveBeenCalledWith(
        expect.stringContaining('id is null')
      );
      expect(mockCancelSubscriptionClient.cancelSubscription).not.toHaveBeenCalled();
    });

    it('logs an error when the reply is null', () => {
      mockCancelSubscriptionClient.cancelSubscription.mockReturnValueOnce(of(null));
      component.cancelSubscription();
      expect(mockLog.error).toHaveBeenCalledWith(
        expect.stringContaining('reply is null')
      );
    });

    it('formats the cancellation date from the Unix timestamp', () => {
      component.cancelSubscription();
      const expectedDate = new Date(MOCK_REPLY.cancel_at * 1000).toString();
      expect(mockSnackBar.info).toHaveBeenCalledWith(
        `Your Subscription will cancel at: ${expectedDate}`
      );
    });
  });
});