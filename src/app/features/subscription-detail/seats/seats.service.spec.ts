import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { SeatsService } from './seats.service';
import { ListSeatReply, ListSeatRequest } from './seats';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

const MOCK_API_URL = 'https://api.example.com';

const mockRequest: ListSeatRequest = {
  subscriptionID: 'sub-1',
  pageIndex: 0,
  pageSize: 5,
};

const mockReply: ListSeatReply = {
  subscriptionID: 'sub-1',
  maxSeats: 10,
  seats: [],
  pageIndex: 0,
  totalResults: 0,
};

describe('SeatsService', () => {
  let service: SeatsService;
  let httpMock: HttpTestingController;
  const authMock = {
    getHttpOptions: vi.fn().mockReturnValue({ headers: {} }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Auth, useValue: authMock },
        { provide: API_URL, useValue: MOCK_API_URL },
      ],
    });

    service = TestBed.inject(SeatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('POSTs to the correct endpoint', () => {
    let result: ListSeatReply | undefined;
    service.getListSeats(mockRequest).subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${MOCK_API_URL}/dashboard/subscription/list-seats`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockReply);

    expect(result).toEqual(mockReply);
  });

  it('uses auth headers from Auth', () => {
    service.getListSeats(mockRequest).subscribe();
    const req = httpMock.expectOne(`${MOCK_API_URL}/dashboard/subscription/list-seats`);
    req.flush(mockReply);
    expect(authMock.getHttpOptions).toHaveBeenCalledOnce();
  });
});