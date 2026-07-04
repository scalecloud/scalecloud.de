import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { CheckoutProductService } from './checkout-product.service';
import { CheckoutProductReply, CheckoutProductRequest } from './checkout-product';
import { AuthService } from 'src/app/core/auth/auth.service';
import { API_URL } from 'src/app/core/config/api.token';

describe('CheckoutProductService', () => {
  let service: CheckoutProductService;
  let httpMock: HttpTestingController;

  const API_BASE = 'https://api.example.test';
  const authService = {
    getHttpOptions: vi.fn(() => ({ headers: { Authorization: 'Bearer test-token' } })),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: API_URL, useValue: API_BASE },
      ],
    });

    service = TestBed.inject(CheckoutProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST the request body to the get-checkout-product endpoint', () => {
    const request: CheckoutProductRequest = { productID: 'prod_123' };
    const reply: CheckoutProductReply = {
      productID: 'prod_123',
      name: 'Pro Plan',
      storageAmount: 100,
      storageUnit: 'GB',
      trialDays: 14,
      pricePerMonth: 1999,
      currency: 'USD',
      has_valid_payment_method: true,
    };

    let actualReply: CheckoutProductReply | undefined;
    service.getCheckoutProduct(request).subscribe((response) => (actualReply = response));

    const req = httpMock.expectOne(`${API_BASE}/checkout-integration/get-checkout-product`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(reply);

    expect(actualReply).toEqual(reply);
  });

  it('should attach the auth headers returned by AuthService.getHttpOptions', () => {
    const request: CheckoutProductRequest = { productID: 'prod_123' };

    service.getCheckoutProduct(request).subscribe();

    const req = httpMock.expectOne(`${API_BASE}/checkout-integration/get-checkout-product`);
    expect(authService.getHttpOptions).toHaveBeenCalled();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush({});
  });

  it('should propagate HTTP errors to the caller', () => {
    const request: CheckoutProductRequest = { productID: 'prod_123' };
    let caughtError: unknown;

    service.getCheckoutProduct(request).subscribe({
      error: (err) => (caughtError = err),
    });

    const req = httpMock.expectOne(`${API_BASE}/checkout-integration/get-checkout-product`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(caughtError).toBeDefined();
  });
});