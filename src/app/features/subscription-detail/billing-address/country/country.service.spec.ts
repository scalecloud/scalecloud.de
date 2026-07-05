import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi, type Mock } from 'vitest';

import { CountryService } from './country.service';
import { Language } from './language';
import { Log } from 'src/app/core/logging/log';

describe('CountryService', () => {
  let service: CountryService;
  let logServiceMock: { warn: Mock; error: Mock };

  beforeEach(() => {
    logServiceMock = { warn: vi.fn(), error: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: Log, useValue: logServiceMock }],
    });
    service = TestBed.inject(CountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCountry', () => {
    it('should return the English name for a known code when language is EN', () => {
      expect(service.getCountry(Language.EN, 'DE')).toBe('Germany');
    });

    it('should return the German name for a known code when language is DE', () => {
      expect(service.getCountry(Language.DE, 'DE')).toBe('Deutschland');
    });

    it('should fall back to the raw code and log a warning when the code is unknown', () => {
      const result = service.getCountry(Language.EN, 'ZZ');

      expect(result).toBe('ZZ');
      expect(logServiceMock.warn).toHaveBeenCalledWith(expect.stringContaining('ZZ'));
    });

    it('should look up codes case-sensitively, matching the dataset format', () => {
      // countries.ts stores codes as uppercase (e.g. 'DE'); a
      // lowercase lookup will miss and fall through to the
      // not-found branch. This documents that behavior rather than
      // assuming case-insensitivity.
      const result = service.getCountry(Language.EN, 'de');

      expect(result).toBe('de');
      expect(logServiceMock.warn).toHaveBeenCalled();
    });
  });

  describe('getCountryCode', () => {
    it('should return the code for a known English name', () => {
      expect(service.getCountryCode(Language.EN, 'Germany')).toBe('DE');
    });

    it('should return the code for a known German name', () => {
      expect(service.getCountryCode(Language.DE, 'Deutschland')).toBe('DE');
    });

    it('should return undefined and log an error when the name is unknown', () => {
      const result = service.getCountryCode(Language.EN, 'Not A Real Country');

      expect(result).toBeUndefined();
      expect(logServiceMock.error).toHaveBeenCalledWith(expect.stringContaining('Not A Real Country'));
    });

    it('should not match an English name when looking up by German language', () => {
      // Cross-language lookups should miss: 'Germany' is the EN
      // name, so searching nameDE for it should not match
      // 'Deutschland'.
      const result = service.getCountryCode(Language.DE, 'Germany');

      expect(result).toBeUndefined();
    });
  });

  describe('getCountries', () => {
    it('should return a non-empty list of countries', () => {
      const result = service.getCountries();

      expect(result.length).toBeGreaterThan(0);
    });

    it('should include entries with both code, nameEN, and nameDE populated', () => {
      const result = service.getCountries();

      expect(result.every((c) => c.code && c.nameEN && c.nameDE)).toBe(true);
    });

    it('should include Germany with the expected fields', () => {
      const result = service.getCountries();
      const germany = result.find((c) => c.code === 'DE');

      expect(germany).toEqual({ code: 'DE', nameDE: 'Deutschland', nameEN: 'Germany' });
    });
  });
});