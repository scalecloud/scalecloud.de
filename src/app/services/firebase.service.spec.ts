import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { FirebaseService } from './firebase.service';

// ── Firebase module mocks ────────────────────────────────────────────────────
// All four Firebase calls happen at field-initialisation time, so they must be
// mocked before the service is constructed.

const mockApp = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
const mockAuth = { currentUser: null, app: mockApp };
const mockAnalytics = { app: mockApp };
const mockPerf = { app: mockApp };

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => mockApp),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => mockAnalytics),
}));

vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => mockPerf),
}));

// ── Tests ────────────────────────────────────────────────────────────────────

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initialises the Firebase app with the environment config', async () => {
    const { initializeApp } = await import('firebase/app');
    const { environment } = await import('src/environments/environment');
    expect(initializeApp).toHaveBeenCalledWith(environment.firebaseConfig);
  });

  it('exposes the Auth instance', () => {
    expect(service.auth).toBe(mockAuth);
  });

  it('exposes the Analytics instance', () => {
    expect(service.analytics).toBe(mockAnalytics);
  });

  it('exposes the Performance instance', () => {
    expect(service.perf).toBe(mockPerf);
  });

  it('passes the same app instance to all SDK initialisers', async () => {
    const { getAuth } = await import('firebase/auth');
    const { getAnalytics } = await import('firebase/analytics');
    const { getPerformance } = await import('firebase/performance');

    expect(getAuth).toHaveBeenCalledWith(mockApp);
    expect(getAnalytics).toHaveBeenCalledWith(mockApp);
    expect(getPerformance).toHaveBeenCalledWith(mockApp);
  });
});