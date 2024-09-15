import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionCancelReply, ISubscriptionCancelRequest } from './subscription-cancel-request';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class CancelSubscriptionService {

  private url = 'http://localhost:15000/dashboard/cancel-subscription';

  constructor(
    private http: HttpClient, 
    private snackBarService: SnackBarService, 
    private authService: AuthService,
    private logService: LogService,
    ) { }

    cancelSubscription(iSubscriptionCancelRequest: ISubscriptionCancelRequest): Observable<ISubscriptionCancelReply> {
    return this.http.post<ISubscriptionCancelReply>(this.url, iSubscriptionCancelRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<ISubscriptionCancelReply>('cancelSubscription'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not cancel subscription. Please try again.`);
      return of(result as T);
    };
  }
  
}
