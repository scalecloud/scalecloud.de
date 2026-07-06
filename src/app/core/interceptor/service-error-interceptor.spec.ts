import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { serviceErrorInterceptor } from './service-error-interceptor';
import { SnackBar } from '../snackbar/snack-bar';
import { Log } from '../logging/log';

const mockSnackBar = { error: vi.fn() };
const mockLog = { error: vi.fn() };

const TEST_URL = '/api/test';

describe('serviceErrorInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serviceErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: SnackBar, useValue: mockSnackBar },
        { provide: Log, useValue: mockLog },
      ],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => httpTesting.verify());

  /** Helper: trigger a request and flush an error response */
  function triggerError(status: number, backendError?: string) {
    let caughtError: Error | undefined;

    httpClient.get(TEST_URL).subscribe({
      error: (e: Error) => (caughtError = e),
    });

    httpTesting.expectOne(TEST_URL).flush(
      backendError ? { error: backendError } : {},
      { status, statusText: 'Error' }
    );

    return caughtError;
  }

  it('passes through successful responses unchanged', () => {
    let body: unknown;
    httpClient.get(TEST_URL).subscribe((b) => (body = b));
    httpTesting.expectOne(TEST_URL).flush({ ok: true });
    expect(body).toEqual({ ok: true });
    expect(mockSnackBar.error).not.toHaveBeenCalled();
  });

  describe('status 0 — no server connection', () => {
    it('shows a connection error message', () => {
      triggerError(0);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'Unable to connect to the server. Please try again later.'
      );
    });
  });

  describe('status 403 — forbidden', () => {
    it('includes backend message when present', () => {
      triggerError(403, 'Forbidden resource');
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'You do not have permission to access this resource. Backend: Forbidden resource'
      );
      expect(mockLog.error).not.toHaveBeenCalled();
    });

    it('logs and shows generic message when backend message is absent', () => {
      triggerError(403);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'You do not have permission to access this resource.'
      );
      expect(mockLog.error).toHaveBeenCalledWith(
        'missing backend error message in 403 error'
      );
    });
  });

  describe('status 404 — not found', () => {
    it('includes backend message when present', () => {
      triggerError(404, 'Item not found');
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'The requested resource was not found. Backend: Item not found'
      );
      expect(mockLog.error).not.toHaveBeenCalled();
    });

    it('logs and shows generic message when backend message is absent', () => {
      triggerError(404);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'The requested resource was not found.'
      );
      expect(mockLog.error).toHaveBeenCalledWith(
        'missing backend error message in 404 error'
      );
    });
  });

  describe('status 408 — request timeout', () => {
    it('shows a timeout message', () => {
      triggerError(408);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'The request timed out. Please try again later.'
      );
    });
  });

  describe('status 429 — too many requests', () => {
    it('shows a rate-limit message', () => {
      triggerError(429);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'You have made too many requests. Please wait and try again later.'
      );
    });
  });

  describe('status 500 — internal server error', () => {
    it('includes backend message when present', () => {
      triggerError(500, 'DB connection failed');
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'An internal server error occurred. Please try again later. Backend: DB connection failed'
      );
      expect(mockLog.error).not.toHaveBeenCalled();
    });

    it('logs and shows generic message when backend message is absent', () => {
      triggerError(500);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'An internal server error occurred. Please try again later.'
      );
      expect(mockLog.error).toHaveBeenCalledWith(
        'missing backend error message in 500 error'
      );
    });
  });

  describe('status 502 — bad gateway', () => {
    it('shows a bad gateway message', () => {
      triggerError(502);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'Bad gateway. Please try again later.'
      );
    });
  });

  describe('status 503 — service unavailable', () => {
    it('shows a service unavailable message', () => {
      triggerError(503);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'The service is currently unavailable. Please try again later.'
      );
    });
  });

  describe('unhandled status codes — default branch', () => {
    it('includes backend message when present', () => {
      triggerError(418, 'I am a teapot');
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'An internal server error occurred. Please try again later. Backend: I am a teapot'
      );
      expect(mockLog.error).not.toHaveBeenCalled();
    });

    it('logs and shows generic message when backend message is absent', () => {
      triggerError(418);
      expect(mockSnackBar.error).toHaveBeenCalledWith(
        'An internal server error occurred. Please try again later.'
      );
      expect(mockLog.error).toHaveBeenCalledWith(
        'missing backend error message in default error'
      );
    });
  });

  describe('error propagation', () => {
    it('rethrows the error so the caller still receives it', () => {
      const caughtError = triggerError(500, 'boom');
      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError?.message).toBe(
        'An internal server error occurred. Please try again later. Backend: boom'
      );
    });
  });
});