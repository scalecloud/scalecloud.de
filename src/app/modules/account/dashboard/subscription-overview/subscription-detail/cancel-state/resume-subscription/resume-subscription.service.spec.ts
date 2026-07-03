import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { API_URL } from 'src/app/core/config/api.token';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ResumeSubscriptionService } from './resume-subscription.service';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';

const API_BASE = 'https://api.example.com';
const RESUME_URL = `${API_BASE}/dashboard/resume-subscription`;
const MOCK_HTTP_OPTIONS = { headers: { Authorization: 'Bearer test-token' } };

const MOCK_REQUEST: ISubscriptionResumeRequest = { subscriptionID: 'sub_123' };

const MOCK_REPLY: ISubscriptionResumeReply = {
  subscriptionID: 'sub_123',
  cancel_at_period_end: false,
};

describe('ResumeSubscriptionService', () => {
  let service: ResumeSubscriptionService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: API_BASE },
        {
          provide: AuthService,
          useValue: { getHttpOptions: vi.fn().mockReturnValue(MOCK_HTTP_OPTIONS) },
        },
      ],
    });

    service = TestBed.inject(ResumeSubscriptionService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensures no unexpected requests were fired during a test.
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resumeSubscription()', () => {
    it('POSTs to the correct URL with the request body', () => {
      service.resumeSubscription(MOCK_REQUEST).subscribe();

      const req = httpTesting.expectOne(RESUME_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(MOCK_REQUEST);
      req.flush(MOCK_REPLY);
    });

    it('forwards the Authorization header from AuthService', () => {
      service.resumeSubscription(MOCK_REQUEST).subscribe();

      const req = httpTesting.expectOne(RESUME_URL);
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(MOCK_REPLY);
    });

    it('emits the reply returned by the API', () => {
      let result: ISubscriptionResumeReply | undefined;
      service.resumeSubscription(MOCK_REQUEST).subscribe((reply) => (result = reply));

      httpTesting.expectOne(RESUME_URL).flush(MOCK_REPLY);

      expect(result).toEqual(MOCK_REPLY);
    });

    it('emits a reply with cancelAtPeriodEnd true when the subscription is still canceling', () => {
      const stillCancelingReply: ISubscriptionResumeReply = { ...MOCK_REPLY, cancel_at_period_end: true };
      let result: ISubscriptionResumeReply | undefined;

      service.resumeSubscription(MOCK_REQUEST).subscribe((reply) => (result = reply));
      httpTesting.expectOne(RESUME_URL).flush(stillCancelingReply);

      expect(result?.cancel_at_period_end).toBe(true);
    });

    it('surfaces HTTP errors to the subscriber', () => {
      let errorStatus: number | undefined;

      service.resumeSubscription(MOCK_REQUEST).subscribe({
        error: (err) => (errorStatus = err.status),
      });

      httpTesting.expectOne(RESUME_URL).flush('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized',
      });

      expect(errorStatus).toBe(401);
    });
  });
});