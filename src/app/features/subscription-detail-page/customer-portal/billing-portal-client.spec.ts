import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { BillingPortalClient } from './billing-portal-client';
import { IBillingPortal } from './billing-portal-model';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

describe('BillingPortalClient', () => {
  const testApiUrl = 'https://api.test.example.com';
  const mockHttpOptions = { headers: { Authorization: 'Bearer test-token' } };

  const authMock = {
    getHttpOptions: vi.fn().mockReturnValue(mockHttpOptions)
  };

  let billingPortalClient: BillingPortalClient;
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

    billingPortalClient = TestBed.inject(BillingPortalClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(billingPortalClient).toBeTruthy();
  });

  it('should GET the billing portal from the correct url using auth http options', () => {
    const mockResponse: IBillingPortal = { url: 'https://billing.example.com/session/abc' };

    billingPortalClient.getBillingPortal().subscribe((result) => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${testApiUrl}/dashboard/billing-portal`);
    expect(req.request.method).toBe('GET');
    expect(authMock.getHttpOptions).toHaveBeenCalled();

    req.flush(mockResponse);
  });
});