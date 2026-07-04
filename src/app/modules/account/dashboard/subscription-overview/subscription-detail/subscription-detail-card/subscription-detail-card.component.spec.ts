import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { SubscriptionDetailCardComponent } from './subscription-detail-card.component';
import { SubscriptionDetailCardService } from './subscription-detail-card-service';
import { CancelStateComponent } from '../cancel-state/cancel-state.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { API_URL } from 'src/app/core/config/api.token';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { SubscriptionDetailReply } from './subscription-detail-card';

// ─── Factories ───────────────────────────────────────────────────────────────

function makeReply(overrides: Partial<SubscriptionDetailReply> = {}): SubscriptionDetailReply {
  return {
    id: 'sub_123',
    active: true,
    product_name: 'Pro Plan',
    product_type: 'cloud',
    storage_amount: 2,
    user_count: 5,
    price_per_month: 999,
    currency: 'usd',
    cancel_at_period_end: false,
    cancel_at: 0,
    status: 'active',
    trial_end: 0,
    current_period_end: 1_800_000_000,
    ...overrides,
  };
}

// ─── Mocks ───────────────────────────────────────────────────────────────────

function makeActivatedRoute(subscriptionID = 'sub_123') {
  return {
    snapshot: { paramMap: convertToParamMap({ subscriptionID }) },
  };
}

function makeAuthService() {
  return {
    waitForAuth: vi.fn().mockResolvedValue(undefined),
    getHttpOptions: vi.fn().mockReturnValue({}),
  };
}

function makePermissionService(hasPermission = true) {
  return { isUser: vi.fn().mockResolvedValue(hasPermission) };
}

function makeSubscriptionService(reply = makeReply()) {
  return {
    getSubscriptionDetail: vi.fn().mockReturnValue(of(reply)),
  };
}

function makeLogService() {
  return { error: vi.fn() };
}

function makeSnackBarService() {
  return { error: vi.fn() };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function stabilize(fixture: ComponentFixture<unknown>): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('SubscriptionDetailCardComponent', () => {
  let component: SubscriptionDetailCardComponent;
  let fixture: ComponentFixture<SubscriptionDetailCardComponent>;

  let authService: ReturnType<typeof makeAuthService>;
  let permissionService: ReturnType<typeof makePermissionService>;
  let subscriptionService: ReturnType<typeof makeSubscriptionService>;
  let logService: ReturnType<typeof makeLogService>;
  let snackBarService: ReturnType<typeof makeSnackBarService>;

  async function setup(options: {
    subscriptionID?: string;
    hasPermission?: boolean;
    reply?: SubscriptionDetailReply;
    waitForAuthResult?: Promise<void>;
  } = {}) {
    const {
      subscriptionID = 'sub_123',
      hasPermission = true,
      reply = makeReply(),
      waitForAuthResult = Promise.resolve(),
    } = options;

    authService = makeAuthService();
    authService.waitForAuth.mockReturnValue(waitForAuthResult);
    permissionService = makePermissionService(hasPermission);
    subscriptionService = makeSubscriptionService(reply);
    logService = makeLogService();
    snackBarService = makeSnackBarService();

    await TestBed.configureTestingModule({
      imports: [SubscriptionDetailCardComponent],
      providers: [
        // Stub API_URL so any deep dependency that escapes the override below
        // does not blow up the injector.
        { provide: API_URL, useValue: 'https://api.test' },
        { provide: ActivatedRoute, useValue: makeActivatedRoute(subscriptionID) },
        { provide: AuthService, useValue: authService },
        { provide: PermissionService, useValue: permissionService },
        { provide: SubscriptionDetailCardService, useValue: subscriptionService },
        { provide: LogService, useValue: logService },
        { provide: SnackBarService, useValue: snackBarService },
      ],
    })
    // CancelStateComponent is a child rendered by the template. Replacing its
    // template and clearing imports/providers prevents Angular from compiling
    // child templates (app-loading-failed etc.) and instantiating the whole
    .overrideComponent(CancelStateComponent, { set: { template: '', imports: [], providers: [] } })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionDetailCardComponent);
    component = fixture.componentInstance;
  }

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', async () => {
    await setup();
    await stabilize(fixture);
    expect(component).toBeTruthy();
  });

  // ── Permission check ──────────────────────────────────────────────────────

  it('sets serviceStatus to Success after a successful load', async () => {
    await setup();
    await stabilize(fixture);

    expect(permissionService.isUser).toHaveBeenCalledWith('sub_123');
    expect(subscriptionService.getSubscriptionDetail).toHaveBeenCalledWith('sub_123');
    expect(component.serviceStatus).toBe(ServiceStatus.Success);
  });

  it('sets serviceStatus to NoPermission when the user lacks access', async () => {
    await setup({ hasPermission: false });
    await stabilize(fixture);

    expect(component.serviceStatus).toBe(ServiceStatus.NoPermission);
    expect(subscriptionService.getSubscriptionDetail).not.toHaveBeenCalled();
  });

  it('sets serviceStatus to Error and shows a snackbar when permission check throws', async () => {
    await setup();
    permissionService.isUser.mockRejectedValue(new Error('network'));

    await stabilize(fixture);

    expect(component.serviceStatus).toBe(ServiceStatus.Error);
    expect(snackBarService.error).toHaveBeenCalledWith(
      'An error occurred while checking permissions.',
    );
  });

  it('sets serviceStatus to Error and logs when subscriptionID is missing', async () => {
    await setup({ subscriptionID: '' });
    await stabilize(fixture);

    expect(component.serviceStatus).toBe(ServiceStatus.Error);
    expect(logService.error).toHaveBeenCalled();
  });

  // ── Data loading ──────────────────────────────────────────────────────────

  it('sets serviceStatus to Error when the API call fails', async () => {
    await setup();
    subscriptionService.getSubscriptionDetail.mockReturnValue(
      throwError(() => new Error('500')),
    );

    await stabilize(fixture);

    expect(component.serviceStatus).toBe(ServiceStatus.Error);
  });

  it('sets serviceStatus to Error when waitForAuth rejects', async () => {
    // A bare Promise.reject() created inline triggers an unhandled-rejection
    // warning before the component's .catch() can register. Attaching a no-op
    // .catch() here silences that while still letting the component handle it.
    const rejected = Promise.reject(new Error('auth failed'));
    rejected.catch(() => {});

    await setup({ waitForAuthResult: rejected });

    // Two stabilize passes are needed because the async chain has two hops:
    //   1. permissionService.isUser() resolves  → reloadSubscriptionDetail() is called
    //   2. waitForAuth() rejects                → .catch() sets ServiceStatus.Error
    // A single whenStable() only drains the first hop.
    await stabilize(fixture);
    await stabilize(fixture);

    expect(component.serviceStatus).toBe(ServiceStatus.Error);
    expect(logService.error).toHaveBeenCalled();
  });

  // ── Accessor methods ──────────────────────────────────────────────────────

  describe('accessor methods', () => {
    const reply = makeReply({
      id: 'sub_abc',
      product_name: 'Enterprise',
      product_type: 'on-premise',
      storage_amount: 10,
      user_count: 3,
      price_per_month: 500,
      currency: 'eur',
      status: 'trialing',
      trial_end: 1_700_000_000,
      cancel_at_period_end: true,
      cancel_at: 1_750_000_000,
      current_period_end: 1_800_000_000,
    });

    beforeEach(async () => {
      await setup({ reply });
      await stabilize(fixture);
    });

    it('getID returns the subscription id', () => {
      expect(component.getID()).toBe('sub_abc');
    });

    it('getProductName returns the product name', () => {
      expect(component.getProductName()).toBe('Enterprise');
    });

    it('getProductType returns the product type', () => {
      expect(component.getProductType()).toBe('on-premise');
    });

    it('getStorageAmount returns storage per user', () => {
      expect(component.getStorageAmount()).toBe(10);
    });

    it('getTotalStorageAmount multiplies storage by user count', () => {
      expect(component.getTotalStorageAmount()).toBe(30); // 10 * 3
    });

    it('getUserCount returns user count', () => {
      expect(component.getUserCount()).toBe(3);
    });

    it('getPricePerMonth returns per-user price', () => {
      expect(component.getPricePerMonth()).toBe(500);
    });

    it('getTotalPricePerMonth multiplies price by user count', () => {
      expect(component.getTotalPricePerMonth()).toBe(1500); // 500 * 3
    });

    it('getCurrency returns uppercased currency code', () => {
      expect(component.getCurrency()).toBe('EUR');
    });

    it('isTrailing returns true when status is trialing', () => {
      expect(component.isTrailing()).toBe(true);
    });

    it('getTrailingEnd returns the trial end timestamp', () => {
      expect(component.getTrailingEnd()).toBe(1_700_000_000);
    });

    it('isCancelAtPeriodEnd returns true when set', () => {
      expect(component.isCancelAtPeriodEnd()).toBe(true);
    });

    it('getCancelAt returns the cancellation timestamp', () => {
      expect(component.getCancelAt()).toBe(1_750_000_000);
    });

    it('getCurrentPeriodEnd returns the renewal timestamp', () => {
      expect(component.getCurrentPeriodEnd()).toBe(1_800_000_000);
    });
  });

  // ── Default / empty-state accessors ───────────────────────────────────────

  describe('accessors return safe defaults before data is loaded', () => {
    beforeEach(async () => {
      // Prevent load from resolving so reply stays undefined
      await setup();
      authService.waitForAuth.mockReturnValue(new Promise(() => {}));
      fixture.detectChanges();
    });

    it('getID returns empty string', () => expect(component.getID()).toBe(''));
    it('isActive returns false', () => expect(component.isActive()).toBe(false));
    it('getProductName returns empty string', () => expect(component.getProductName()).toBe(''));
    it('getStorageAmount returns 0', () => expect(component.getStorageAmount()).toBe(0));
    it('getUserCount returns 0', () => expect(component.getUserCount()).toBe(0));
    it('getPricePerMonth returns 0', () => expect(component.getPricePerMonth()).toBe(0));
    it('getCurrency returns empty string', () => expect(component.getCurrency()).toBe(''));
    it('isTrailing returns false', () => expect(component.isTrailing()).toBe(false));
    it('isCancelAtPeriodEnd returns false', () => expect(component.isCancelAtPeriodEnd()).toBe(false));
  });

  // ── reloadSubscriptionDetail ──────────────────────────────────────────────

  it('reloads subscription data and updates reply on success', async () => {
    const first = makeReply({ product_name: 'Starter' });
    const second = makeReply({ product_name: 'Pro' });

    await setup({ reply: first });
    await stabilize(fixture);

    subscriptionService.getSubscriptionDetail.mockReturnValue(of(second));
    component.reloadSubscriptionDetail();
    await stabilize(fixture);

    expect(component.getProductName()).toBe('Pro');
    expect(component.serviceStatus).toBe(ServiceStatus.Success);
  });
});