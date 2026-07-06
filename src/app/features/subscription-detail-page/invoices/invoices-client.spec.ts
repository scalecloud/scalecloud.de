import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { InvoicesClient } from './invoices-client';
import { InvoiceStatus, ListInvoicesReply, ListInvoicesRequest } from './invoices-model';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

describe('InvoicesClient', () => {
  let service: InvoicesClient;
  let httpMock: HttpTestingController;

  const fakeApiUrl = 'https://api.example.test';
  const fakeHttpOptions = { headers: { Authorization: 'Bearer test-token' } };

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

    service = TestBed.inject(InvoicesClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to the correct invoices endpoint', () => {
    const request: ListInvoicesRequest = {
      subscriptionID: 'sub_123',
      pageSize: 5
    };

    service.getInvoices(request).subscribe();

    const req = httpMock.expectOne(`${fakeApiUrl}/dashboard/subscription/invoices`);
    expect(req.request.method).toBe('POST');
    req.flush({ subscriptionID: 'sub_123', invoices: [], totalResults: 0 });
  });

  it('should send the request body unchanged', () => {
    const request: ListInvoicesRequest = {
      subscriptionID: 'sub_123',
      pageSize: 5,
      startingAfter: 'inv_1',
      endingBefore: undefined
    };

    service.getInvoices(request).subscribe();

    const req = httpMock.expectOne(`${fakeApiUrl}/dashboard/subscription/invoices`);
    expect(req.request.body).toEqual(request);
    req.flush({ subscriptionID: 'sub_123', invoices: [], totalResults: 0 });
  });

  it('should attach auth headers from Auth.getHttpOptions', () => {
    const request: ListInvoicesRequest = { subscriptionID: 'sub_123', pageSize: 5 };

    service.getInvoices(request).subscribe();

    const req = httpMock.expectOne(`${fakeApiUrl}/dashboard/subscription/invoices`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({ subscriptionID: 'sub_123', invoices: [], totalResults: 0 });
  });

  it('should emit the reply returned by the API', async () => {
    const request: ListInvoicesRequest = { subscriptionID: 'sub_123', pageSize: 5 };
    const mockReply: ListInvoicesReply = {
      subscriptionID: 'sub_123',
      invoices: [
        {
          invoiceID: 'inv_1',
          subscriptionID: 'sub_123',
          created: 1700000000,
          total: 1999,
          currency: 'usd',
          status: InvoiceStatus.Paid,
          invoice_pdf: 'https://example.test/inv_1.pdf'
        }
      ],
      totalResults: 1
    };

    const resultPromise = new Promise<ListInvoicesReply>((resolve) => {
      service.getInvoices(request).subscribe((reply) => resolve(reply));
    });

    const req = httpMock.expectOne(`${fakeApiUrl}/dashboard/subscription/invoices`);
    req.flush(mockReply);

    const result = await resultPromise;
    expect(result).toEqual(mockReply);
  });

  it('should propagate an error response', async () => {
    const request: ListInvoicesRequest = { subscriptionID: 'sub_123', pageSize: 5 };

    const errorPromise = new Promise<unknown>((resolve) => {
      service.getInvoices(request).subscribe({
        next: () => resolve(undefined),
        error: (err) => resolve(err)
      });
    });

    const req = httpMock.expectOne(`${fakeApiUrl}/dashboard/subscription/invoices`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    const error = await errorPromise;
    expect(error).toBeDefined();
    expect((error as { status: number }).status).toBe(500);
  });
});