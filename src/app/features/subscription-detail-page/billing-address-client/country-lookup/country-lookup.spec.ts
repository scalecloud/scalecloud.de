import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi, type Mock } from 'vitest';
import { Log } from 'src/app/core/logging/log';
import { CountryLookup } from './country-lookup';
import { Language } from './language-model';

describe('CountryLookup', () => {
  let countryLookup: CountryLookup;
  let logMock: { warn: Mock; error: Mock };

  beforeEach(() => {
    logMock = { warn: vi.fn(), error: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: Log, useValue: logMock }],
    });
    countryLookup = TestBed.inject(CountryLookup);
  });

  it('should be created', () => {
    expect(countryLookup).toBeTruthy();
  });

  describe('getCountry', () => {
    it('should return the English name for a known code when language is EN', () => {
      expect(countryLookup.getCountry(Language.EN, 'DE')).toBe('Germany');
    });

    it('should return the German name for a known code when language is DE', () => {
      expect(countryLookup.getCountry(Language.DE, 'DE')).toBe('Deutschland');
    });

    it('should fall back to the raw code and log a warning when the code is unknown', () => {
      const result = countryLookup.getCountry(Language.EN, 'ZZ');

      expect(result).toBe('ZZ');
      expect(logMock.warn).toHaveBeenCalledWith(expect.stringContaining('ZZ'));
    });

    it('should look up codes case-sensitively, matching the dataset format', () => {
      // countries.ts stores codes as uppercase (e.g. 'DE'); a
      // lowercase lookup will miss and fall through to the
      // not-found branch. This documents that behavior rather than
      // assuming case-insensitivity.
      const result = countryLookup.getCountry(Language.EN, 'de');

      expect(result).toBe('de');
      expect(logMock.warn).toHaveBeenCalled();
    });
  });

  describe('getCountryCode', () => {
    it('should return the code for a known English name', () => {
      expect(countryLookup.getCountryCode(Language.EN, 'Germany')).toBe('DE');
    });

    it('should return the code for a known German name', () => {
      expect(countryLookup.getCountryCode(Language.DE, 'Deutschland')).toBe('DE');
    });

    it('should return undefined and log an error when the name is unknown', () => {
      const result = countryLookup.getCountryCode(Language.EN, 'Not A Real Country');

      expect(result).toBeUndefined();
      expect(logMock.error).toHaveBeenCalledWith(expect.stringContaining('Not A Real Country'));
    });

    it('should not match an English name when looking up by German language', () => {
      // Cross-language lookups should miss: 'Germany' is the EN
      // name, so searching nameDE for it should not match
      // 'Deutschland'.
      const result = countryLookup.getCountryCode(Language.DE, 'Germany');

      expect(result).toBeUndefined();
    });
  });

  describe('getCountries', () => {
    it('should return a non-empty list of countries', () => {
      const result = countryLookup.getCountries();

      expect(result.length).toBeGreaterThan(0);
    });

    it('should include entries with both code, nameEN, and nameDE populated', () => {
      const result = countryLookup.getCountries();

      expect(result.every((c) => c.code && c.nameEN && c.nameDE)).toBe(true);
    });

    it('should include Germany with the expected fields', () => {
      const result = countryLookup.getCountries();
      const germany = result.find((c) => c.code === 'DE');

      expect(germany).toEqual({ code: 'DE', nameDE: 'Deutschland', nameEN: 'Germany' });
    });
  });
});