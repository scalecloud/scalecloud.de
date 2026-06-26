import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi, describe, beforeEach, afterEach, expect, it } from 'vitest';

import { ChangePaymentService } from './change-payment.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangePaymentReply } from './change-payment';

describe(ChangePaymentService.name, () => {
  let service: ChangePaymentService;
  let httpMock: HttpTestingController;

  const httpOptions = {
    headers: {
      Authorization: 'Bearer token',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChangePaymentService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            getHttpOptions: vi.fn().mockReturnValue(httpOptions),
          },
        },
      ],
    });

    service = TestBed.inject(ChangePaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request a setup intent', () => {
    const expected: ChangePaymentReply = {
      setupintentid: 'si_123',
      clientsecret: 'secret',
      email: 'john@example.com',
    };

    service.getChangePaymentSetupIntent().subscribe(reply => {
      expect(reply).toEqual(expected);
    });

    const req = httpMock.expectOne(
      'http://localhost:15000/dashboard/get-change-payment-setup-intent',
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();

    req.flush(expected);
  });
});