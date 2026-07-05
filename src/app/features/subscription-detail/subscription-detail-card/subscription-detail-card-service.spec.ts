import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { SubscriptionDetailCardService } from './subscription-detail-card-service';
import { API_URL } from 'src/app/core/config/api.token';
import { SubscriptionDetailReply } from './subscription-detail-card';
import { Auth } from 'src/app/core/auth/auth';

// ─── Constants ───────────────────────────────────────────────────────────────

const TEST_API_URL = 'https://api.test';
const BASE_URL = `${TEST_API_URL}/dashboard/subscription`;

// ─── Factories ───────────────────────────────────────────────────────────────

function makeReply(overrides: Partial<SubscriptionDetailReply> = {}): SubscriptionDetailReply {
  return {
    id: 'sub_123',
    active: true,
    product_name: 'Pro Plan',
    product_type: 'cloud',
    storage_amount: 2,
    user_count: 5,
    price_per_month: 999,
    currency: 'usd',
    cancel_at_period_end: false,
    cancel_at: 0,
    status: 'active',
    trial_end: 0,
    current_period_end: 1_800_000_000,
    ...overrides,
  };
}

function makeAuthOptions(token = 'Bearer test-token') {
  return { headers: { Authorization: token } };
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('SubscriptionDetailCardService', () => {
  let service: SubscriptionDetailCardService;
  let http: HttpTestingController;
  let auth: { getHttpOptions: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    auth = { getHttpOptions: vi.fn().mockReturnValue(makeAuthOptions()) };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: TEST_API_URL },
        { provide: Auth, useValue: auth },
      ],
    });

    service = TestBed.inject(SubscriptionDetailCardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── URL construction ──────────────────────────────────────────────────────

  it('sends a GET to the correct URL for a given id', () => {
    service.getSubscriptionDetail('sub_123').subscribe();

    const req = http.expectOne(`${BASE_URL}/sub_123`);
    expect(req.request.method).toBe('GET');
    req.flush(makeReply());
  });

  it('interpolates the id into the URL correctly', () => {
    service.getSubscriptionDetail('abc-456').subscribe();

    http.expectOne(`${BASE_URL}/abc-456`).flush(makeReply());
    // if we reach here without http.verify() throwing, the URL was correct
  });

  it('treats each id as a separate URL segment — no double slashes', () => {
    service.getSubscriptionDetail('xyz').subscribe();

    const req = http.expectOne(`${BASE_URL}/xyz`);
    expect(req.request.url).not.toContain('//dashboard');
    req.flush(makeReply());
  });

  // ── Auth headers ──────────────────────────────────────────────────────────

  it('calls getHttpOptions() on every request', () => {
    service.getSubscriptionDetail('sub_1').subscribe();
    http.expectOne(`${BASE_URL}/sub_1`).flush(makeReply());

    service.getSubscriptionDetail('sub_2').subscribe();
    http.expectOne(`${BASE_URL}/sub_2`).flush(makeReply());

    expect(auth.getHttpOptions).toHaveBeenCalledTimes(2);
  });

  it('forwards the Authorization header returned by Auth', () => {
    auth.getHttpOptions.mockReturnValue(makeAuthOptions('Bearer my-token'));

    service.getSubscriptionDetail('sub_123').subscribe();

    const req = http.expectOne(`${BASE_URL}/sub_123`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-token');
    req.flush(makeReply());
  });

  it('forwards a refreshed token when Auth returns a new one', () => {
    auth.getHttpOptions
      .mockReturnValueOnce(makeAuthOptions('Bearer token-v1'))
      .mockReturnValueOnce(makeAuthOptions('Bearer token-v2'));

    service.getSubscriptionDetail('a').subscribe();
    const reqA = http.expectOne(`${BASE_URL}/a`);
    expect(reqA.request.headers.get('Authorization')).toBe('Bearer token-v1');
    reqA.flush(makeReply());

    service.getSubscriptionDetail('b').subscribe();
    const reqB = http.expectOne(`${BASE_URL}/b`);
    expect(reqB.request.headers.get('Authorization')).toBe('Bearer token-v2');
    reqB.flush(makeReply());
  });

  // ── Response mapping ──────────────────────────────────────────────────────

  it('emits the full reply object returned by the API', () => {
    const reply = makeReply({ id: 'sub_abc', product_name: 'Enterprise', user_count: 10 });
    let result: SubscriptionDetailReply | undefined;

    service.getSubscriptionDetail('sub_abc').subscribe(r => (result = r));
    http.expectOne(`${BASE_URL}/sub_abc`).flush(reply);

    expect(result).toEqual(reply);
  });

  it('completes the observable after a single emission', () => {
    let completed = false;

    service.getSubscriptionDetail('sub_123').subscribe({ complete: () => (completed = true) });
    http.expectOne(`${BASE_URL}/sub_123`).flush(makeReply());

    expect(completed).toBe(true);
  });

  // ── Error handling ────────────────────────────────────────────────────────

  it('propagates a 404 error to the subscriber', () => {
    let caughtError: unknown;

    service.getSubscriptionDetail('missing').subscribe({ error: e => (caughtError = e) });
    http.expectOne(`${BASE_URL}/missing`)
      .flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(caughtError).toBeTruthy();
  });

  it('propagates a 500 error to the subscriber', () => {
    let caughtError: unknown;

    service.getSubscriptionDetail('sub_err').subscribe({ error: e => (caughtError = e) });
    http.expectOne(`${BASE_URL}/sub_err`)
      .flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(caughtError).toBeTruthy();
  });

  it('propagates a 401 error to the subscriber', () => {
    let caughtError: unknown;

    service.getSubscriptionDetail('sub_unauth').subscribe({ error: e => (caughtError = e) });
    http.expectOne(`${BASE_URL}/sub_unauth`)
      .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(caughtError).toBeTruthy();
  });

  // ── Concurrency ───────────────────────────────────────────────────────────

  it('handles concurrent requests for different ids independently', () => {
    const replyA = makeReply({ id: 'aaa' });
    const replyB = makeReply({ id: 'bbb' });
    let resultA: SubscriptionDetailReply | undefined;
    let resultB: SubscriptionDetailReply | undefined;

    service.getSubscriptionDetail('aaa').subscribe(r => (resultA = r));
    service.getSubscriptionDetail('bbb').subscribe(r => (resultB = r));

    http.expectOne(`${BASE_URL}/aaa`).flush(replyA);
    http.expectOne(`${BASE_URL}/bbb`).flush(replyB);

    expect(resultA).toEqual(replyA);
    expect(resultB).toEqual(replyB);
  });
});