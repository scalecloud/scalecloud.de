import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { CancelStateService } from './cancel-state.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CancelStateReply } from './cancel-state';
import { API_URL } from 'src/app/core/config/api.token';
import { environment } from 'src/environments/environment';

const SUBSCRIPTION_ID = 'sub-abc-123';
const BASE_URL        = `${environment.apiUrl}/dashboard/subscription`;
const EXPECTED_URL    = `${BASE_URL}/${SUBSCRIPTION_ID}/cancel-state`;

const MOCK_HTTP_OPTIONS = { headers: { Authorization: 'Bearer test-token' } };

const mockAuthService = {
  getHttpOptions: vi.fn().mockReturnValue(MOCK_HTTP_OPTIONS),
};

const MOCK_REPLY: CancelStateReply = {
  subscriptionID:       SUBSCRIPTION_ID,
  cancel_at_period_end: false,
};

describe('CancelStateService', () => {
  let service:       CancelStateService;
  let httpTesting:   HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: environment.apiUrl },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    service     = TestBed.inject(CancelStateService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  // ── Creation ───────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getCancelState ─────────────────────────────────────────────────────

  describe('getCancelState', () => {
    it('makes a GET request to the correct URL', () => {
      service.getCancelState(SUBSCRIPTION_ID).subscribe();
      const req = httpTesting.expectOne(EXPECTED_URL);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_REPLY);
    });

    it('constructs the URL with the provided subscription ID', () => {
      const otherId = 'sub-xyz-999';
      service.getCancelState(otherId).subscribe();
      const req = httpTesting.expectOne(`${BASE_URL}/${otherId}/cancel-state`);
      req.flush(MOCK_REPLY);
      expect(req.request.url).toContain(otherId);
    });

    it('passes the auth HTTP options from AuthService', () => {
      service.getCancelState(SUBSCRIPTION_ID).subscribe();
      const req = httpTesting.expectOne(EXPECTED_URL);
      expect(mockAuthService.getHttpOptions).toHaveBeenCalled();
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(MOCK_REPLY);
    });

    it('returns the reply from the server', () => {
      let result: CancelStateReply | undefined;
      service.getCancelState(SUBSCRIPTION_ID).subscribe(r => (result = r));
      httpTesting.expectOne(EXPECTED_URL).flush(MOCK_REPLY);
      expect(result).toEqual(MOCK_REPLY);
    });

    it('surfaces HTTP errors to the subscriber', () => {
      let errorStatus: number | undefined;
      service.getCancelState(SUBSCRIPTION_ID).subscribe({
        error: (e) => (errorStatus = e.status),
      });
      httpTesting.expectOne(EXPECTED_URL).flush(null, { status: 500, statusText: 'Server Error' });
      expect(errorStatus).toBe(500);
    });
  });
});