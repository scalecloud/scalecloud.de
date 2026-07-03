import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { FirebaseService } from './firebase.service';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { environment } from 'src/environments/environment';

// ── Firebase module mocks ────────────────────────────────────────────────────
// All four Firebase calls happen at field-initialisation time, so they must be
// mocked before the service is constructed (vi.mock is hoisted above these imports).

vi.mock('firebase/app', () => {
  const mockApp = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
  return {
    initializeApp: vi.fn(() => mockApp),
  };
});

vi.mock('firebase/auth', () => {
  const mockApp = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
  const mockAuth = { currentUser: null, app: mockApp };
  return {
    getAuth: vi.fn(() => mockAuth),
  };
});

vi.mock('firebase/analytics', () => {
  const mockApp = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
  const mockAnalytics = { app: mockApp };
  return {
    getAnalytics: vi.fn(() => mockAnalytics),
  };
});

vi.mock('firebase/performance', () => {
  const mockApp = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
  const mockPerf = { app: mockApp };
  return {
    getPerformance: vi.fn(() => mockPerf),
  };
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(() => {
    // Without this, mock call counts leak between tests.
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });

    // providedIn: 'root' + field initializers means construction (and the
    // initializeApp/getAuth/getAnalytics/getPerformance calls) happens here,
    // fresh, every test - only guaranteed if the previous module was reset.
    service = TestBed.inject(FirebaseService);
  });

  afterEach(() => {
    // Without this, TestBed can hand back the same cached root singleton
    // across tests instead of constructing a fresh one, so the field
    // initializers (and the mock calls inside them) never re-run.
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initialises the Firebase app with the environment config', () => {
    expect(initializeApp).toHaveBeenCalledWith(environment.firebaseConfig);
  });

  it('exposes the Auth instance', () => {
    expect(service.auth).toBeTruthy();
    expect(service.auth).toHaveProperty('currentUser');
  });

  it('exposes the Analytics instance', () => {
    expect(service.analytics).toBeTruthy();
    expect(service.analytics).toHaveProperty('app');
  });

  it('exposes the Performance instance', () => {
    expect(service.perf).toBeTruthy();
    expect(service.perf).toHaveProperty('app');
  });

  it('initialises all SDK modules', () => {
    expect(initializeApp).toHaveBeenCalled();
    expect(getAuth).toHaveBeenCalled();
    expect(getAnalytics).toHaveBeenCalled();
    expect(getPerformance).toHaveBeenCalled();
  });
});