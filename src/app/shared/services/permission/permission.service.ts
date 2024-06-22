import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, of } from 'rxjs';
import { PermissionRequest, PermissionReply } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/seats/seats';
import { AuthService } from '../auth.service';
import { LogService } from '../log/log.service';
import { SnackBarService } from '../snackbar/snack-bar.service';
import { Role } from '../../roles/roles';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private urlPermission = 'http://localhost:15000/dashboard/subscription/permission';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
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
      const request: PermissionRequest = {
        subscriptionID: subscriptionID,
      };
      const reply = await firstValueFrom(this.getPermissions(request));
      return reply?.mySeat?.roles?.includes(role);
    } catch (error) {
      this.logService.error("hasPermission failed: " + error.message);
      return false;
    }
  }

  getPermissions(request: PermissionRequest): Observable<PermissionReply> {
    return this.http.post<PermissionReply>(this.urlPermission, request, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<PermissionReply>('getPermissions'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not add seat. Please try again later.`);
      return of(result as T);
    };
  }
}
