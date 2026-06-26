import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SubscriptionOverviewService } from './subscription-overview.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

describe('SubscriptionOverviewService', () => {
  let service: SubscriptionOverviewService;
  let httpTestingController: HttpTestingController;
  const authServiceMock = { getHttpOptions: vi.fn().mockReturnValue({}) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    });
    service = TestBed.inject(SubscriptionOverviewService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request subscription overview', () => {
    const mockOverview = [{ id: 'sub-1', name: 'Test Subscription' }];

    service.getSubscriptionsOverview().subscribe((result) => {
      expect(result).toEqual(mockOverview);
    });

    const req = httpTestingController.expectOne('http://localhost:15000/dashboard/subscriptions');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.keys()).toEqual([]);
    req.flush(mockOverview);
  });
});
