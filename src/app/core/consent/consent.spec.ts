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

  it('starts undecided with optional improvements disabled', () => {
    expect(consent.decided()).toBe(false);
    expect(consent.bannerVisible()).toBe(true);
    expect(consent.improvements()).toBe(false);
  });

  it('stores acceptance of optional improvements', () => {
    consent.acceptAll();

    expect(consent.decided()).toBe(true);
    expect(consent.bannerVisible()).toBe(false);
    expect(consent.improvements()).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      version: 4,
      improvements: true,
    });
  });

  it('stores rejection of optional improvements', () => {
    consent.rejectAll();

    expect(consent.decided()).toBe(true);
    expect(consent.bannerVisible()).toBe(false);
    expect(consent.improvements()).toBe(false);
  });

  it('stores a customized selection and can reopen settings', () => {
    consent.save(true);
    consent.reopen();

    expect(consent.bannerVisible()).toBe(true);
    expect(consent.improvements()).toBe(true);
  });

  it('requires a new choice after the consent categories change', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 3,
      timestamp: Date.now(),
      analytics: true,
      sessionReplay: true,
    }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    consent = TestBed.inject(Consent);

    expect(consent.decided()).toBe(false);
    expect(consent.bannerVisible()).toBe(true);
    expect(consent.improvements()).toBe(false);
  });

  it('ignores a stored choice older than one year', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 4,
      timestamp: Date.now() - MAX_AGE_MS - 1,
      improvements: true,
    }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    consent = TestBed.inject(Consent);

    expect(consent.decided()).toBe(false);
    expect(consent.improvements()).toBe(false);
  });
});