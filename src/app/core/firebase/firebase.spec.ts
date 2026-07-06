import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import {
  Firebase,
  INITIALIZE_APP,
  GET_AUTH,
  GET_ANALYTICS,
  GET_PERFORMANCE,
} from './firebase';
import { environment } from 'src/environments/environment';

// ── Firebase mocking note ────────────────────────────────────────────────────
// This spec previously used `vi.mock('firebase/app', ...)` etc. directly.
// That's unreliable under this project's esbuild-bundled Angular unit-test
// runner once a module like 'firebase/auth' is reached from more than one
// source file with different mock shapes - it silently falls through to the
// real SDK instead of the mock (same root cause documented in
// auth.spec.ts). The tell was concrete: the "0 calls" assertion
// failures showed up alongside real Firebase Analytics network calls in the
// test log, meaning the actual SDK ran - not a mock the assertions merely
// lost track of.
//
// Firebase is the SDK boundary, so its own spec can't sidestep the
// problem by substituting Firebase (that's what Auth's spec
// does). Instead, Firebase now exposes the four SDK factory calls as
// injection tokens, and this spec overrides those tokens - a plain runtime
// object swap via Angular DI, unaffected by module-resolution quirks.

describe('Firebase', () => {
  let firebase: Firebase;

  const mockApp = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
  const mockAuth = { currentUser: null, app: mockApp };
  const mockAnalytics = { app: mockApp };
  const mockPerf = { app: mockApp };

  const initializeAppMock = vi.fn(() => mockApp);
  const getAuthMock = vi.fn(() => mockAuth);
  const getAnalyticsMock = vi.fn(() => mockAnalytics);
  const getPerformanceMock = vi.fn(() => mockPerf);

  beforeEach(() => {
    // Without this, mock call counts leak between tests.
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: INITIALIZE_APP, useValue: initializeAppMock },
        { provide: GET_AUTH, useValue: getAuthMock },
        { provide: GET_ANALYTICS, useValue: getAnalyticsMock },
        { provide: GET_PERFORMANCE, useValue: getPerformanceMock },
      ],
    });

    // providedIn: 'root' + field initializers means construction (and the
    // initializeApp/getAuth/getAnalytics/getPerformance calls) happens here,
    // fresh, every test - only guaranteed if the previous module was reset.
    firebase = TestBed.inject(Firebase);
  });

  afterEach(() => {
    // Without this, TestBed can hand back the same cached root singleton
    // across tests instead of constructing a fresh one, so the field
    // initializers (and the mock calls inside them) never re-run.
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(firebase).toBeTruthy();
  });

  it('initialises the Firebase app with the environment config', () => {
    expect(initializeAppMock).toHaveBeenCalledWith(environment.firebaseConfig);
  });

  it('exposes the Auth instance', () => {
    // Identity check, not just shape - proves the DI override actually flows
    // through rather than the real SDK coincidentally having the same shape.
    expect(firebase.auth).toBe(mockAuth);
    expect(firebase.auth).toHaveProperty('currentUser');
  });

  it('exposes the Analytics instance', () => {
    expect(firebase.analytics).toBe(mockAnalytics);
    expect(firebase.analytics).toHaveProperty('app');
  });

  it('exposes the Performance instance', () => {
    expect(firebase.perf).toBe(mockPerf);
    expect(firebase.perf).toHaveProperty('app');
  });

  it('initialises all SDK modules', () => {
    expect(initializeAppMock).toHaveBeenCalled();
    expect(getAuthMock).toHaveBeenCalled();
    expect(getAnalyticsMock).toHaveBeenCalled();
    expect(getPerformanceMock).toHaveBeenCalled();
  });
});