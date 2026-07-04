import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';

import { SeatDetailService } from './seat-detail.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { API_URL } from 'src/app/core/config/api.token';
import {
  SeatDetailRequest,
  SeatDetailReply,
  UpdateSeatDetailRequest,
  UpdateSeatDetailReply,
  DeleteSeatRequest,
  DeleteSeatReply,
} from '../seats';
import { Role } from 'src/app/core/permission/roles';

const MOCK_API_URL = 'https://api.example.com';

function makeSeat(overrides = {}) {
  return {
    subscriptionID: 'sub-1',
    uid: 'u1',
    email: 'alice@example.com',
    emailVerified: true,
    roles: [Role.Administrator],
    ...overrides,
  };
}

describe('SeatDetailService', () => {
  let service: SeatDetailService;
  let httpMock: HttpTestingController;

  const authServiceMock = {
    getHttpOptions: vi.fn().mockReturnValue({ headers: {} }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: API_URL, useValue: MOCK_API_URL },
      ],
    });

    service = TestBed.inject(SeatDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── getSeat ────────────────────────────────────────────────────────────────

  it('getSeat POSTs to the seat-detail endpoint', async () => {
    const request: SeatDetailRequest = { subscriptionID: 'sub-1', uid: 'u1' };
    const reply: SeatDetailReply = { selectedSeat: makeSeat(), mySeat: makeSeat({ uid: 'me' }) };

    const result$ = firstValueFrom(service.getSeat(request));

    const req = httpMock.expectOne(`${MOCK_API_URL}/dashboard/subscription/seat-detail`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(reply);

    expect(await result$).toEqual(reply);
  });

  // ── updateSeat ─────────────────────────────────────────────────────────────

  it('updateSeat POSTs to the update-seat endpoint', async () => {
    const request: UpdateSeatDetailRequest = { seatUpdated: makeSeat() };
    const reply: UpdateSeatDetailReply = { seat: makeSeat() };

    const result$ = firstValueFrom(service.updateSeat(request));

    const req = httpMock.expectOne(`${MOCK_API_URL}/dashboard/subscription/update-seat`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(reply);

    expect(await result$).toEqual(reply);
  });

  // ── deleteSeat ─────────────────────────────────────────────────────────────

  it('deleteSeat POSTs to the delete-seat endpoint', async () => {
    const seat = makeSeat();
    const request: DeleteSeatRequest = { seatToDelete: seat };
    const reply: DeleteSeatReply = { deletedSeat: seat, success: true };

    const result$ = firstValueFrom(service.deleteSeat(request));

    const req = httpMock.expectOne(`${MOCK_API_URL}/dashboard/subscription/delete-seat`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(reply);

    expect(await result$).toEqual(reply);
  });

  // ── Auth headers ───────────────────────────────────────────────────────────

  it('attaches auth headers on every call', async () => {
    const result$ = firstValueFrom(service.getSeat({ subscriptionID: 'sub-1', uid: 'u1' }));

    const req = httpMock.expectOne(`${MOCK_API_URL}/dashboard/subscription/seat-detail`);
    req.flush({});

    await result$;
    expect(authServiceMock.getHttpOptions).toHaveBeenCalled();
  });
});