import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi, describe, beforeEach, afterEach, expect, it } from 'vitest';

import { ChangePaymentService } from './change-payment.service';
import { ChangePaymentReply } from './change-payment';
import { API_URL } from 'src/app/core/config/api.token';
import { environment } from 'src/environments/environment';
import { Auth } from 'src/app/core/auth/auth';

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
          provide: API_URL,
          useValue: environment.apiUrl,
        },
        {
          provide: Auth,
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
      `${environment.apiUrl}/dashboard/get-change-payment-setup-intent`,
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();

    req.flush(expected);
  });
});