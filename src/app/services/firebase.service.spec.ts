import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { FirebaseService } from './firebase.service';

// ── Firebase module mocks ────────────────────────────────────────────────────
// All four Firebase calls happen at field-initialisation time, so they must be
// mocked before the service is constructed. Each mock creates its own objects
// to avoid hoisting issues with variable references.

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

  it('initialises all SDK modules', async () => {
    const { getAuth } = await import('firebase/auth');
    const { getAnalytics } = await import('firebase/analytics');
    const { getPerformance } = await import('firebase/performance');
    const { initializeApp } = await import('firebase/app');

    expect(initializeApp).toHaveBeenCalled();
    expect(getAuth).toHaveBeenCalled();
    expect(getAnalytics).toHaveBeenCalled();
    expect(getPerformance).toHaveBeenCalled();
  });
});