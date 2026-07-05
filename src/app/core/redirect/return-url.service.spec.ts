import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Location } from '@angular/common';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { ReturnUrlService } from './return-url.service';
import { LogService } from '../logging/log.service';
import { APP_BASE_URL } from '../config/api-token';

describe('ReturnUrlService', () => {
  let service: ReturnUrlService;

  const BASE_URL = 'https://base.example.com';

  const router = {
    navigate: vi.fn(),
    navigateByUrl: vi.fn(),
    parseUrl: vi.fn((url: string) => ({ toString: () => url }) as UrlTree),
  };
  const logService = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const location = { path: vi.fn(() => '/current/path') };
  const documentMock = { location: { origin: 'https://example.com' } };

  // Backing state for the ActivatedRoute snapshot mock, reset each test.
  let queryParamMap: Map<string, string>;
  let queryParams: Record<string, string>;

  const activatedRoute = {
    snapshot: {
      get queryParamMap() {
        return { get: (key: string) => queryParamMap.get(key) ?? null };
      },
      get queryParams() {
        return queryParams;
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryParamMap = new Map();
    queryParams = {};
    location.path.mockReturnValue('/current/path');

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: LogService, useValue: logService },
        { provide: DOCUMENT, useValue: documentMock },
        { provide: Location, useValue: location },
        { provide: APP_BASE_URL, useValue: BASE_URL },
      ],
    });

    service = TestBed.inject(ReturnUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openUrlKeepReturnUrl', () => {
    it('should navigate keeping the decoded returnUrl as a query param', () => {
      queryParamMap.set('returnUrl', encodeURIComponent('/dashboard?x=1'));

      service.openUrlKeepReturnUrl('/next');

      expect(router.navigate).toHaveBeenCalledWith(['/next'], {
        queryParams: { returnUrl: '/dashboard?x=1' },
      });
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should log an error and navigateByUrl when returnUrl is missing', () => {
      service.openUrlKeepReturnUrl('/next');

      expect(logService.error).toHaveBeenCalledWith('ReturnUrl not in query params.');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/next');
    });
  });

  describe('openReturnURL', () => {
    it('should navigate to the parsed decoded returnUrl and log info', () => {
      queryParamMap.set('returnUrl', encodeURIComponent('/settings'));

      service.openReturnURL('/default');

      expect(router.parseUrl).toHaveBeenCalledWith('/settings');
      expect(logService.info).toHaveBeenCalledWith('Opening returnUrl: /settings');
      expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should log an error and navigate to defaultUrl when returnUrl is missing', () => {
      service.openReturnURL('/default');

      expect(logService.error).toHaveBeenCalledWith(
        'ReturnUrl not in query params. Open defaultUrl: /default',
      );
      expect(router.navigate).toHaveBeenCalledWith(['/default']);
    });
  });

  describe('getSpecifiedUrlWithReturnUrl', () => {
    it('should build a url from domain + route + query params', () => {
      queryParams = { foo: 'bar' };

      const result = service.getSpecifiedUrlWithReturnUrl('/invite');

      expect(result).toBe('https://example.com/invite?foo=bar');
      expect(logService.error).not.toHaveBeenCalled();
    });

    it('should fall back to baseURL and log an error when the route does not start with /', () => {
      const result = service.getSpecifiedUrlWithReturnUrl('invite');

      expect(result).toBe(BASE_URL);
      expect(logService.error).toHaveBeenCalledWith(
        'getSpecifiedUrlWithReturnUrl failed: ' + BASE_URL,
      );
    });
  });

  describe('getReturnUrlDecoded', () => {
    it('should return domain + decoded path when returnUrl starts with /', () => {
      queryParamMap.set('returnUrl', encodeURIComponent('/profile'));

      const result = service.getReturnUrlDecoded();

      expect(result).toBe('https://example.com/profile');
      expect(logService.error).not.toHaveBeenCalled();
    });

    it('should fall back to baseURL and log an error when returnUrl is missing', () => {
      const result = service.getReturnUrlDecoded();

      expect(result).toBe(BASE_URL);
      expect(logService.error).toHaveBeenCalledWith('getReturnUrlDecoded failed: ' + BASE_URL);
    });

    it('should fall back to baseURL when the decoded returnUrl does not start with /', () => {
      queryParamMap.set('returnUrl', encodeURIComponent('https://evil.example.com/x'));

      const result = service.getReturnUrlDecoded();

      expect(result).toBe(BASE_URL);
    });
  });

  describe('openUrlAddReturnUrl', () => {
    it('should navigate with the current location path as the returnUrl', () => {
      location.path.mockReturnValue('/current/path?x=1');

      service.openUrlAddReturnUrl('/login');

      expect(router.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/current/path?x=1' },
      });
    });
  });
});