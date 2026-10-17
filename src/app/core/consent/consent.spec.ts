import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Consent } from './consent';

const STORAGE_KEY = 'scalecloud.consent';
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

describe('Consent', () => {
  let consent: Consent;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    consent = TestBed.inject(Consent);
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('starts undecided with optional categories disabled', () => {
    expect(consent.decided()).toBe(false);
    expect(consent.bannerVisible()).toBe(true);
    expect(consent.analytics()).toBe(false);
    expect(consent.errorMonitoring()).toBe(false);
  });

  it('stores acceptance of all optional categories', () => {
    consent.acceptAll();

    expect(consent.decided()).toBe(true);
    expect(consent.bannerVisible()).toBe(false);
    expect(consent.analytics()).toBe(true);
    expect(consent.errorMonitoring()).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 1,
      analytics: true,
      errorMonitoring: true,
    });
  });

  it('stores rejection of all optional categories', () => {
    consent.rejectAll();

    expect(consent.decided()).toBe(true);
    expect(consent.bannerVisible()).toBe(false);
    expect(consent.analytics()).toBe(false);
    expect(consent.errorMonitoring()).toBe(false);
  });

  it('stores a customized selection and can reopen settings', () => {
    consent.save(true, false);
    consent.reopen();

    expect(consent.bannerVisible()).toBe(true);
    expect(consent.analytics()).toBe(true);
    expect(consent.errorMonitoring()).toBe(false);
  });

  it('ignores a stored choice older than one year', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      timestamp: Date.now() - MAX_AGE_MS - 1,
      analytics: true,
      errorMonitoring: true,
    }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    consent = TestBed.inject(Consent);

    expect(consent.decided()).toBe(false);
    expect(consent.analytics()).toBe(false);
  });
});