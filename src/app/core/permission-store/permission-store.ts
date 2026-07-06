import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Auth } from '../auth/auth';
import { Log } from '../logging/log';
import { Role } from './roles';
import { API_URL } from '../config/api-token';
import { PermissionReply, PermissionRequest } from 'src/app/features/subscription-detail-page/seats/seats-model';

interface CacheEntry {
  data: PermissionReply;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionStore {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly log = inject(Log);

  private readonly apiUrl = inject(API_URL);
  private readonly urlPermission = `${this.apiUrl}/dashboard/subscription/permission`;
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheDuration = 60000; // 1 minute in milliseconds
  loadingPermissions: WritableSignal<boolean> = signal(false);

  async isOwner(subscriptionID: string): Promise<boolean> {
    return this.hasPermission(subscriptionID, Role.Owner);
  }

  async isAdministrator(subscriptionID: string): Promise<boolean> {
    return this.hasPermission(subscriptionID, Role.Administrator);
  }

  async isUser(subscriptionID: string): Promise<boolean> {
    return this.hasPermission(subscriptionID, Role.User);
  }

  async isBilling(subscriptionID: string): Promise<boolean> {
    return this.hasPermission(subscriptionID, Role.Billing);
  }

  async hasPermission(subscriptionID: string, role: Role): Promise<boolean> {
    try {
      const cacheEntry = this.cache.get(subscriptionID);
      const now = Date.now();

      if (cacheEntry && (now - cacheEntry.timestamp < this.cacheDuration)) {
        return cacheEntry.data.mySeat?.roles?.includes(role);
      }

      this.loadingPermissions.set(true);
      const request: PermissionRequest = {
        subscriptionID: subscriptionID,
      };
      const reply = await firstValueFrom(this.getPermissions(request));
      this.cache.set(subscriptionID, { data: reply, timestamp: now });
      return reply?.mySeat?.roles?.includes(role);
    } catch (error) {
      this.log.error("hasPermission failed: " + error.message);
      return false;
    } finally {
      this.loadingPermissions.set(false);
    }
  }

  getPermissions(request: PermissionRequest): Observable<PermissionReply> {
    return this.http.post<PermissionReply>(this.urlPermission, request, this.auth.getHttpOptions());
  }

}