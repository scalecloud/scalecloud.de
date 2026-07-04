import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Component, input, output } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { CancelStateComponent } from './cancel-state.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CancelStateService } from './cancel-state.service';
import { LogService } from 'src/app/core/logging/log.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { PermissionService } from 'src/app/core/permission/permission.service';
import { ServiceStatus } from 'src/app/shared/service-status';
import { CancelStateReply } from './cancel-state';

// ── Stubs ─────────────────────────────────────────────────────────────────────

@Component({ selector: 'app-resume-subscription', template: '', standalone: true })
class ResumeSubscriptionStub { readonly reply = input<any>(undefined); readonly reloadSubscriptionDetailEvent = output(); }

@Component({ selector: 'app-cancel-subscription', template: '', standalone: true })
class CancelSubscriptionStub { readonly reply = input<any>(undefined); readonly reloadSubscriptionDetailEvent = output(); }

@Component({ selector: 'app-loading-failed', template: '', standalone: true })
class LoadingFailedStub { }

@Component({ selector: 'ngx-skeleton-loader', template: '', standalone: true })
class SkeletonLoaderStub { readonly count = input<any>(undefined); readonly appearance = input<any>(undefined); }

// ── Mocks ─────────────────────────────────────────────────────────────────────

const SUBSCRIPTION_ID = 'sub-abc-123';

const mockActivatedRoute = {
  snapshot: { paramMap: { get: vi.fn().mockReturnValue(SUBSCRIPTION_ID) } },
};

const mockAuthService       = { waitForAuth: vi.fn().mockResolvedValue(void 0) };
const mockLogService        = { error: vi.fn(), info: vi.fn() };
const mockSnackBarService   = { error: vi.fn() };
const mockPermissionService = { isBilling: vi.fn().mockResolvedValue(true) };

const MOCK_REPLY: CancelStateReply = {
  subscriptionID:       SUBSCRIPTION_ID,
  cancel_at_period_end: false,
};

const mockCancelStateService = {
  getCancelState: vi.fn().mockReturnValue(of(MOCK_REPLY)),
};

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('CancelStateComponent', () => {
  let component: CancelStateComponent;
  let fixture:   ComponentFixture<CancelStateComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CancelStateComponent],
      providers: [
        { provide: ActivatedRoute,     useValue: mockActivatedRoute },
        { provide: AuthService,        useValue: mockAuthService },
        { provide: CancelStateService, useValue: mockCancelStateService },
        { provide: LogService,         useValue: mockLogService },
        { provide: SnackBarService,    useValue: mockSnackBarService },
        { provide: PermissionService,  useValue: mockPermissionService },
      ],
    })
    .overrideComponent(CancelStateComponent, {
      remove: { imports: [] },
      add: {
        imports: [
          ResumeSubscriptionStub,
          CancelSubscriptionStub,
          LoadingFailedStub,
          SkeletonLoaderStub,
        ],
      },
    })
    .compileComponents();

    fixture   = TestBed.createComponent(CancelStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ── Creation ─────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── getSubscriptionID ────────────────────────────────────────────────────

  describe('getSubscriptionID', () => {
    it('returns the subscriptionID from the route', () => {
      expect(component.getSubscriptionID()).toBe(SUBSCRIPTION_ID);
    });

    it('returns an empty string when the param is absent', () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValueOnce(null);
      expect(component.getSubscriptionID()).toBe('');
    });
  });

  // ── checkPermissions ─────────────────────────────────────────────────────

  describe('checkPermissions', () => {
    it('calls getCancelState when the user has billing permission', async () => {
      mockPermissionService.isBilling.mockResolvedValueOnce(true);
      await component.checkPermissions();
      expect(mockCancelStateService.getCancelState).toHaveBeenCalledWith(SUBSCRIPTION_ID);
    });

    it('sets serviceStatus to NoPermission when the user lacks billing permission', async () => {
      mockPermissionService.isBilling.mockResolvedValueOnce(false);
      await component.checkPermissions();
      expect(component.serviceStatus).toBe(ServiceStatus.NoPermission);
    });

    it('sets serviceStatus to Error and shows a snackbar when permission check throws', async () => {
      mockPermissionService.isBilling.mockRejectedValueOnce(new Error('network'));
      await component.checkPermissions();
      expect(component.serviceStatus).toBe(ServiceStatus.Error);
      expect(mockSnackBarService.error).toHaveBeenCalledWith(
        'An error occurred while checking permissions.'
      );
    });

    it('logs and sets Error status when subscriptionID is missing', async () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValueOnce(null);
      await component.checkPermissions();
      expect(mockLogService.error).toHaveBeenCalledWith(
        expect.stringContaining('subscriptionID is null')
      );
      expect(component.serviceStatus).toBe(ServiceStatus.Error);
    });
  });

  // ── getCancelState ───────────────────────────────────────────────────────

  describe('getCancelState', () => {
    it('sets serviceStatus to Success on a successful response', async () => {
      mockCancelStateService.getCancelState.mockReturnValueOnce(of(MOCK_REPLY));
      await component.getCancelState();
      expect(component.serviceStatus).toBe(ServiceStatus.Success);
    });

    it('stores the reply on success', async () => {
      const reply: CancelStateReply = { subscriptionID: SUBSCRIPTION_ID, cancel_at_period_end: true };
      mockCancelStateService.getCancelState.mockReturnValueOnce(of(reply));
      await component.getCancelState();
      expect(component.reply).toEqual(reply);
    });

    it('sets serviceStatus to Error when the service call fails', async () => {
      mockCancelStateService.getCancelState.mockReturnValueOnce(
        throwError(() => new Error('server error'))
      );
      await component.getCancelState();
      expect(component.serviceStatus).toBe(ServiceStatus.Error);
    });

    it('logs and sets Error status when waitForAuth rejects', async () => {
      mockAuthService.waitForAuth.mockRejectedValueOnce(new Error('auth failed'));
      await component.getCancelState();
      expect(mockLogService.error).toHaveBeenCalledWith(
        expect.stringContaining('waitForAuth failed')
      );
      expect(component.serviceStatus).toBe(ServiceStatus.Error);
    });

    it('logs and does not call the service when subscriptionID is missing', async () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValueOnce(null);
      vi.clearAllMocks();
      mockAuthService.waitForAuth.mockResolvedValueOnce(void 0);
      await component.getCancelState();
      expect(mockCancelStateService.getCancelState).not.toHaveBeenCalled();
    });
  });

  // ── isEnding ─────────────────────────────────────────────────────────────

  describe('isEnding', () => {
    it('returns false when reply is null', () => {
      component.reply = null;
      expect(component.isEnding()).toBe(false);
    });

    it('returns false when cancel_at_period_end is false', () => {
      component.reply = { subscriptionID: SUBSCRIPTION_ID, cancel_at_period_end: false };
      expect(component.isEnding()).toBe(false);
    });

    it('returns true when cancel_at_period_end is true', () => {
      component.reply = { subscriptionID: SUBSCRIPTION_ID, cancel_at_period_end: true };
      expect(component.isEnding()).toBe(true);
    });
  });

  // ── reloadSubscriptionDetail ─────────────────────────────────────────────

  describe('reloadSubscriptionDetail', () => {
    it('re-fetches the cancel state', () => {
      const spy = vi.spyOn(component, 'getCancelState');
      component.reloadSubscriptionDetail();
      expect(spy).toHaveBeenCalled();
    });

    it('emits reloadSubscriptionDetailEvent', () => {
      const spy = vi.spyOn(component.reloadSubscriptionDetailEvent, 'emit');
      component.reloadSubscriptionDetail();
      expect(spy).toHaveBeenCalled();
    });
  });
});