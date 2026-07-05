import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from '../checkout-create-subscription';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';
import { CheckoutSubscriptionService } from './checkout-subscription.service';

describe('CheckoutSubscriptionService', () => {
  let service: CheckoutSubscriptionService;
  let httpMock: HttpTestingController;

  const fakeApiUrl = 'https://api.example.test';
  const fakeHttpOptions = { headers: { Authorization: 'Bearer test-token' } };
  const expectedUrl = `${fakeApiUrl}/checkout-integration/create-checkout-subscription`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: fakeApiUrl },
        {
          provide: Auth,
          useValue: {
            getHttpOptions: vi.fn().mockReturnValue(fakeHttpOptions)
          }
        }
      ]
    });

    service = TestBed.inject(CheckoutSubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to the correct checkout-subscription endpoint', () => {
    const request: CheckoutCreateSubscriptionRequest = {
      productID: 'prod_123',
      quantity: 1
    };

    service.createCheckoutSubscription(request).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush({
      status: 'active',
      subscriptionID: 'sub_123',
      productName: 'Pro Plan',
      email: 'user@example.test',
      trialEnd: 0
    });
  });

  it('should send the request body unchanged', () => {
    const request: CheckoutCreateSubscriptionRequest = {
      productID: 'prod_123',
      quantity: 3
    };

    service.createCheckoutSubscription(request).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.body).toEqual(request);
    req.flush({
      status: 'active',
      subscriptionID: 'sub_123',
      productName: 'Pro Plan',
      email: 'user@example.test',
      trialEnd: 0
    });
  });

  it('should attach auth headers from Auth.getHttpOptions', () => {
    const request: CheckoutCreateSubscriptionRequest = {
      productID: 'prod_123',
      quantity: 1
    };

    service.createCheckoutSubscription(request).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({
      status: 'active',
      subscriptionID: 'sub_123',
      productName: 'Pro Plan',
      email: 'user@example.test',
      trialEnd: 0
    });
  });

  it('should emit the reply returned by the API', async () => {
    const request: CheckoutCreateSubscriptionRequest = {
      productID: 'prod_123',
      quantity: 2
    };
    const mockReply: CheckoutCreateSubscriptionReply = {
      status: 'trialing',
      subscriptionID: 'sub_456',
      productName: 'Team Plan',
      email: 'team@example.test',
      trialEnd: 1735689600
    };

    const resultPromise = new Promise<CheckoutCreateSubscriptionReply>((resolve) => {
      service.createCheckoutSubscription(request).subscribe((reply) => resolve(reply));
    });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(mockReply);

    const result = await resultPromise;
    expect(result).toEqual(mockReply);
  });

  it('should propagate an error response', async () => {
    const request: CheckoutCreateSubscriptionRequest = {
      productID: 'prod_123',
      quantity: 1
    };

    const errorPromise = new Promise<unknown>((resolve) => {
      service.createCheckoutSubscription(request).subscribe({
        next: () => resolve(undefined),
        error: (err) => resolve(err)
      });
    });

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    const error = await errorPromise;
    expect(error).toBeDefined();
    expect((error as { status: number }).status).toBe(500);
  });
});