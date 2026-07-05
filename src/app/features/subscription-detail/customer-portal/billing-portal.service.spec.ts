import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { BillingPortalService } from './billing-portal.service';
import { IBillingPortal } from './billing-portal';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

describe('BillingPortalService', () => {
  const testApiUrl = 'https://api.test.example.com';
  const mockHttpOptions = { headers: { Authorization: 'Bearer test-token' } };

  const authMock = {
    getHttpOptions: vi.fn().mockReturnValue(mockHttpOptions)
  };

  let service: BillingPortalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: testApiUrl },
        { provide: Auth, useValue: authMock }
      ]
    });

    service = TestBed.inject(BillingPortalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET the billing portal from the correct url using auth http options', () => {
    const mockResponse: IBillingPortal = { url: 'https://billing.example.com/session/abc' };

    service.getBillingPortal().subscribe((result) => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${testApiUrl}/dashboard/billing-portal`);
    expect(req.request.method).toBe('GET');
    expect(authMock.getHttpOptions).toHaveBeenCalled();

    req.flush(mockResponse);
  });
});