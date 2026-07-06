import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard-page';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { SubscriptionOverviewClient } from './subscription-overview/subscription-overview-client';
import { LastCountStore } from './subscription-overview/last-count/last-count-store';
import { ServiceStatus } from 'src/app/shared/client-status';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { SubscriptionOverviewModel } from './subscription-overview/subscription-overview-model';

const mockSubscriptions: SubscriptionOverviewModel[] = [
  {
    id: '1',
    active: true,
    productName: 'Product A',
    productType: 'Type A',
    storageAmount: 100,
    userCount: 5,
  },
  {
    id: '2',
    active: false,
    productName: 'Product B',
    productType: 'Type B',
    storageAmount: 200,
    userCount: 10,
  },
];

const authMock = {
  waitForAuth: vi.fn().mockResolvedValue(undefined),
};

const subscriptionOverviewClientMock = {
  getSubscriptionsOverview: vi.fn().mockReturnValue(of(mockSubscriptions)),
};

const logMock = {
  error: vi.fn(),
};

const lastCountStoreMock = {
  getLastSubscriptionOverviewCount: 2,
  set setLastSubscriptionOverviewCount(v: number) {},
};

const snackBarMock = {
  show: vi.fn(),
};

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: authMock },
        { provide: SubscriptionOverviewClient, useValue: subscriptionOverviewClientMock },
        { provide: Log, useValue: logMock },
        { provide: LastCountStore, useValue: lastCountStoreMock },
        { provide: SnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reach Success status after loading', async () => {
    await fixture.whenStable();
    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
  });

  it('should populate reply with subscriptions', async () => {
    await fixture.whenStable();
    expect(component.reply()).toEqual(mockSubscriptions);
  });

  it('should produce the correct number of skeleton items', () => {
    expect(component.skeletonItems().length).toBe(lastCountStoreMock.getLastSubscriptionOverviewCount);
  });

  it('should set Error status when getSubscriptionsOverview fails', async () => {
    subscriptionOverviewClientMock.getSubscriptionsOverview.mockReturnValue(
      throwError(() => new Error('API error'))
    );

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  it('should set Error status and log when waitForAuth fails', async () => {
    authMock.waitForAuth.mockRejectedValue(new Error('Auth failed'));

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logMock.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed')
    );
  });
});