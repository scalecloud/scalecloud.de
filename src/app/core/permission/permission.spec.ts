import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { of, throwError, Subject } from 'rxjs';

import { Permission } from './permission';
import { Auth } from '../auth/auth';
import { Log } from '../logging/log';
import { Role } from './roles';
import { PermissionReply } from 'src/app/features/subscription-detail/seats/seats';
import { API_URL } from '../config/api-token';

describe('Permission', () => {
  let service: Permission;

  const SUBSCRIPTION_ID = 'sub-1';
  const OTHER_SUBSCRIPTION_ID = 'sub-2';
  const API_BASE = 'https://api.example.com';

  const httpClient = { post: vi.fn() };
  const authMock = { getHttpOptions: vi.fn(() => ({ headers: { Authorization: 'Bearer token' } })) };
  const logService = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  function makeReply(roles: Role[]): PermissionReply {
    return { mySeat: { roles } } as PermissionReply;
  }

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: Auth, useValue: authMock },
        { provide: Log, useValue: logService },
        { provide: API_URL, useValue: API_BASE },
      ],
    });

    service = TestBed.inject(Permission);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loadingPermissions false', () => {
    expect(service.loadingPermissions()).toBe(false);
  });

  describe('getPermissions', () => {
    it('should POST to the permission endpoint with the subscriptionID and auth headers', () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Owner])));

      service.getPermissions({ subscriptionID: SUBSCRIPTION_ID });

      expect(httpClient.post).toHaveBeenCalledWith(
        `${API_BASE}/dashboard/subscription/permission`,
        { subscriptionID: SUBSCRIPTION_ID },
        { headers: { Authorization: 'Bearer token' } },
      );
    });
  });

  describe('hasPermission', () => {
    it('should return true when the requested role is present', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Administrator])));

      const result = await service.hasPermission(SUBSCRIPTION_ID, Role.Administrator);

      expect(result).toBe(true);
    });

    it('should return false when the requested role is absent', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.User])));

      const result = await service.hasPermission(SUBSCRIPTION_ID, Role.Administrator);

      expect(result).toBe(false);
    });

    it('should set loadingPermissions true while the request is in flight, then false', async () => {
      const subject = new Subject<PermissionReply>();
      httpClient.post.mockReturnValue(subject.asObservable());

      const pending = service.hasPermission(SUBSCRIPTION_ID, Role.Owner);
      await Promise.resolve();
      expect(service.loadingPermissions()).toBe(true);

      subject.next(makeReply([Role.Owner]));
      subject.complete();
      await pending;

      expect(service.loadingPermissions()).toBe(false);
    });

    it('should cache the reply and not issue a second HTTP call within the cache window', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Owner])));

      await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);
      await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);

      expect(httpClient.post).toHaveBeenCalledTimes(1);
    });

    it('should reuse the cached reply for a different role on the same subscription', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Owner, Role.Administrator])));

      await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);
      const result = await service.hasPermission(SUBSCRIPTION_ID, Role.Administrator);

      expect(httpClient.post).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should not share the cache across different subscriptionIDs', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Owner])));

      await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);
      await service.hasPermission(OTHER_SUBSCRIPTION_ID, Role.Owner);

      expect(httpClient.post).toHaveBeenCalledTimes(2);
    });

    it('should issue a fresh HTTP call once the cache entry has expired', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Owner])));
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);

      vi.setSystemTime(now + 61_000);
      await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);

      expect(httpClient.post).toHaveBeenCalledTimes(2);
    });

    it('should log an error and return false when the HTTP call fails', async () => {
      httpClient.post.mockReturnValue(throwError(() => new Error('network down')));

      const result = await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);

      expect(result).toBe(false);
      expect(logService.error).toHaveBeenCalledWith('hasPermission failed: network down');
    });

    it('should reset loadingPermissions to false even when the request fails', async () => {
      httpClient.post.mockReturnValue(throwError(() => new Error('boom')));

      await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);

      expect(service.loadingPermissions()).toBe(false);
    });

    it('should not cache a failed request', async () => {
      httpClient.post.mockReturnValueOnce(throwError(() => new Error('boom')));
      httpClient.post.mockReturnValueOnce(of(makeReply([Role.Owner])));

      const first = await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);
      const second = await service.hasPermission(SUBSCRIPTION_ID, Role.Owner);

      expect(first).toBe(false);
      expect(second).toBe(true);
      expect(httpClient.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('role convenience methods', () => {
    it('isOwner should resolve true when the Owner role is present', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Owner])));
      expect(await service.isOwner(SUBSCRIPTION_ID)).toBe(true);
    });

    it('isAdministrator should resolve true when the Administrator role is present', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Administrator])));
      expect(await service.isAdministrator(SUBSCRIPTION_ID)).toBe(true);
    });

    it('isUser should resolve true when the User role is present', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.User])));
      expect(await service.isUser(SUBSCRIPTION_ID)).toBe(true);
    });

    it('isBilling should resolve true when the Billing role is present', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.Billing])));
      expect(await service.isBilling(SUBSCRIPTION_ID)).toBe(true);
    });

    it('isOwner should resolve false when the Owner role is absent', async () => {
      httpClient.post.mockReturnValue(of(makeReply([Role.User])));
      expect(await service.isOwner(SUBSCRIPTION_ID)).toBe(false);
    });
  });
});