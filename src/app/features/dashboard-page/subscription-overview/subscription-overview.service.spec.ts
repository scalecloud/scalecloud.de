import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SubscriptionOverviewService } from './subscription-overview.service';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';
import { environment } from 'src/environments/environment';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

describe('SubscriptionOverviewService', () => {
  let service: SubscriptionOverviewService;
  let httpTestingController: HttpTestingController;
  const authMock = { getHttpOptions: vi.fn().mockReturnValue({}) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: API_URL, useValue: environment.apiUrl },
        { provide: Auth, useValue: authMock }
      ]
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

    const req = httpTestingController.expectOne(`${environment.apiUrl}/dashboard/subscriptions`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.keys()).toEqual([]);
    req.flush(mockOverview);
  });
});
