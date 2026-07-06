import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BillingAddressClient } from './billing-address-client';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';
import { environment } from 'src/environments/environment';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

describe('BillingAddressClient', () => {
  let service: BillingAddressClient;
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
    service = TestBed.inject(BillingAddressClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post billing address request', () => {
    const request = { subscriptionID: '123' };
    const response = { name: 'Test User', address: { line1: 'Street 1', line2: '', postal_code: '12345', city: 'Test City', country: 'DE' }, phone: '+4912345678' };

    service.getBillingAddress(request).subscribe((reply) => {
      expect(reply).toEqual(response);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/dashboard/subscription/billing-address`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    expect(req.request.headers.keys()).toEqual([]);
    req.flush(response);
  });
});
