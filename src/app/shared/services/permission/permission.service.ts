import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { LogService } from '../log/log.service';
import { Role } from '../../roles/roles';
import { PermissionReply, PermissionRequest } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/seats/seats';

interface CacheEntry {
  data: PermissionReply;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private urlPermission = 'http://localhost:15000/dashboard/subscription/permission';
  private cache: Map<string, CacheEntry> = new Map();
  private cacheDuration = 60000; // 1 minute in milliseconds
  loadingPermissions: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly logService: LogService,
  ) { }

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
      this.logService.error("hasPermission failed: " + error.message);
      return false;
    } finally {
      this.loadingPermissions.set(false);
    }
  }

  getPermissions(request: PermissionRequest): Observable<PermissionReply> {
    return this.http.post<PermissionReply>(this.urlPermission, request, this.authService.getHttpOptions());
  }

}