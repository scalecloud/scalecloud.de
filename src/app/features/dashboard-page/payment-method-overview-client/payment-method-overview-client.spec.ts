import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PaymentMethodOverviewClient } from './payment-method-overview-client';
import { PaymentMethodOverviewReply } from './payment-method-overview-model';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

const mockHttpOptions = { headers: new HttpHeaders() };

const authMock = {
  getHttpOptions: vi.fn().mockReturnValue(mockHttpOptions),
};

const mockReply: PaymentMethodOverviewReply = {
  has_valid_payment_method: true,
  type: 'card',
  card: { brand: 'visa', last4: '4242', exp_month: 12, exp_year: 2026 },
  sepa_debit: { country: 'DE', last4: '1234' },
  paypal: { email: 'test@example.com' },
};

describe('PaymentMethodOverviewClient', () => {
  let service: PaymentMethodOverviewClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Auth, useValue: authMock },
        { provide: API_URL, useValue: 'https://api.example.com' },
      ],
    });

    service = TestBed.inject(PaymentMethodOverviewClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to the correct URL and return the response', () => {
    service.getPaymentMethodOverview().subscribe((result) => {
      expect(result).toEqual(mockReply);
    });

    const req = httpMock.expectOne('https://api.example.com/dashboard/get-payment-method-overview');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(mockReply);
  });

  it('should call getHttpOptions on the auth service', () => {
    service.getPaymentMethodOverview().subscribe();

    const req = httpMock.expectOne('https://api.example.com/dashboard/get-payment-method-overview');
    req.flush(mockReply);

    expect(authMock.getHttpOptions).toHaveBeenCalledOnce();
  });
});