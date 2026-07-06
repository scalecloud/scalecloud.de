import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { SubscriptionCancelReply, SubscriptionCancelRequest } from './subscription-cancel-request-model';
import { environment } from 'src/environments/environment';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';
import { CancelSubscriptionClient } from './cancel-subscription-client';

const EXPECTED_URL = `${environment.apiUrl}/dashboard/cancel-subscription`;

const MOCK_HTTP_OPTIONS = { headers: { Authorization: 'Bearer test-token' } };

const mockAuth = {
  getHttpOptions: vi.fn().mockReturnValue(MOCK_HTTP_OPTIONS),
};

const MOCK_REQUEST: SubscriptionCancelRequest = {
  subscriptionID: 'sub-abc-123',
};

const MOCK_REPLY: SubscriptionCancelReply = {
  subscriptionID:       'sub-abc-123',
  cancel_at_period_end: true,
  cancel_at:            1893456000,
};

describe('CancelSubscriptionClient', () => {
  let service:     CancelSubscriptionClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: environment.apiUrl },
        { provide: Auth, useValue: mockAuth },
      ],
    });

    service     = TestBed.inject(CancelSubscriptionClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  // ── Creation ───────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── cancelSubscription ─────────────────────────────────────────────────

  describe('cancelSubscription', () => {
    it('makes a POST request to the correct URL', () => {
      service.cancelSubscription(MOCK_REQUEST).subscribe();
      const req = httpTesting.expectOne(EXPECTED_URL);
      expect(req.request.method).toBe('POST');
      req.flush(MOCK_REPLY);
    });

    it('sends the request body with the correct subscriptionID', () => {
      service.cancelSubscription(MOCK_REQUEST).subscribe();
      const req = httpTesting.expectOne(EXPECTED_URL);
      expect(req.request.body).toEqual(MOCK_REQUEST);
      req.flush(MOCK_REPLY);
    });

    it('passes the auth HTTP options from Auth', () => {
      service.cancelSubscription(MOCK_REQUEST).subscribe();
      const req = httpTesting.expectOne(EXPECTED_URL);
      expect(mockAuth.getHttpOptions).toHaveBeenCalled();
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(MOCK_REPLY);
    });

    it('returns the reply from the server', () => {
      let result: SubscriptionCancelReply | undefined;
      service.cancelSubscription(MOCK_REQUEST).subscribe(r => (result = r));
      httpTesting.expectOne(EXPECTED_URL).flush(MOCK_REPLY);
      expect(result).toEqual(MOCK_REPLY);
    });

    it('surfaces HTTP errors to the subscriber', () => {
      let errorStatus: number | undefined;
      service.cancelSubscription(MOCK_REQUEST).subscribe({
        error: (e) => (errorStatus = e.status),
      });
      httpTesting.expectOne(EXPECTED_URL).flush(null, { status: 500, statusText: 'Server Error' });
      expect(errorStatus).toBe(500);
    });

    it('surfaces 403 errors to the subscriber', () => {
      let errorStatus: number | undefined;
      service.cancelSubscription(MOCK_REQUEST).subscribe({
        error: (e) => (errorStatus = e.status),
      });
      httpTesting.expectOne(EXPECTED_URL).flush(null, { status: 403, statusText: 'Forbidden' });
      expect(errorStatus).toBe(403);
    });
  });
});