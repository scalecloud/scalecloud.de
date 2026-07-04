import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';
import { LogService } from 'src/app/core/logging/log.service';
import { LastCountService } from './subscription-overview/LastCount/last-count.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { of, throwError } from 'rxjs';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { provideRouter } from '@angular/router';

const mockSubscriptions: ISubscriptionOverview[] = [
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

const authServiceMock = {
  waitForAuth: vi.fn().mockResolvedValue(undefined),
};

const subscriptionOverviewServiceMock = {
  getSubscriptionsOverview: vi.fn().mockReturnValue(of(mockSubscriptions)),
};

const logServiceMock = {
  error: vi.fn(),
};

const lastCountServiceMock = {
  getLastSubscriptionOverviewCount: 2,
  set setLastSubscriptionOverviewCount(v: number) {},
};

const snackBarServiceMock = {
  show: vi.fn(),
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: SubscriptionOverviewService, useValue: subscriptionOverviewServiceMock },
        { provide: LogService, useValue: logServiceMock },
        { provide: LastCountService, useValue: lastCountServiceMock },
        { provide: SnackBarService, useValue: snackBarServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
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
    expect(component.skeletonItems().length).toBe(lastCountServiceMock.getLastSubscriptionOverviewCount);
  });

  it('should set Error status when getSubscriptionsOverview fails', async () => {
    subscriptionOverviewServiceMock.getSubscriptionsOverview.mockReturnValue(
      throwError(() => new Error('API error'))
    );

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  it('should set Error status and log when waitForAuth fails', async () => {
    authServiceMock.waitForAuth.mockRejectedValue(new Error('Auth failed'));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logServiceMock.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed')
    );
  });
});