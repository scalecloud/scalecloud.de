import { HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { API_URL } from '../../core/config/api-token';
import { Log } from '../../core/logging/log';
import { SnackBar } from '../../core/snackbar/snack-bar';
import { serviceErrorInterceptor } from '../../core/interceptor/service-error-interceptor';
import { InvitationClient } from './invitation-client';

describe('InvitationClient', () => {
  let client: InvitationClient;
  let httpTesting: HttpTestingController;
  const snackBar = { error: vi.fn() };
  const log = { error: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serviceErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'https://api.example.test' },
        { provide: SnackBar, useValue: snackBar },
        { provide: Log, useValue: log },
      ],
    });
    client = TestBed.inject(InvitationClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    TestBed.resetTestingModule();
  });

  it('sends a public preview request with only the invitation token', () => {
    client.preview('private-invitation-token').subscribe();

    const request = httpTesting.expectOne('https://api.example.test/invitation/preview');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ token: 'private-invitation-token' });
    request.flush({
      productName: 'OpenCloud Storage',
      storageAmount: 4,
      storageUnit: 'TB',
      email: 'invitee@example.test',
      roles: ['member'],
      expiresAt: 1_800_000_000,
    });
  });

  it('sends a claim request with the same token and preserves API status errors', () => {
    let caughtError: unknown;
    client.claim('private-invitation-token').subscribe({ error: error => caughtError = error });

    const request = httpTesting.expectOne('https://api.example.test/invitation/claim');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ token: 'private-invitation-token' });
    request.flush({}, { status: 503, statusText: 'Service Unavailable' });

    expect(caughtError).toBeInstanceOf(HttpErrorResponse);
    expect((caughtError as HttpErrorResponse).status).toBe(503);
    expect(snackBar.error).not.toHaveBeenCalled();
  });
});