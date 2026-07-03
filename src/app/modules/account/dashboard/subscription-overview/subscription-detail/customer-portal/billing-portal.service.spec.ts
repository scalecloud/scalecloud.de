import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { BillingPortalService } from './billing-portal.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { API_URL } from 'src/app/core/config/api.token';
import { IBillingPortal } from './billing-portal';

describe('BillingPortalService', () => {
  const testApiUrl = 'https://api.test.example.com';
  const mockHttpOptions = { headers: { Authorization: 'Bearer test-token' } };

  const authServiceMock = {
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
        { provide: AuthService, useValue: authServiceMock }
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
    expect(authServiceMock.getHttpOptions).toHaveBeenCalled();

    req.flush(mockResponse);
  });
});