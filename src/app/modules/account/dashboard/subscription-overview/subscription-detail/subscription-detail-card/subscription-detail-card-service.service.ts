import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SubscriptionDetailReply } from './subscription-detail-card';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailCardServiceService {

  private url = 'http://localhost:15000/dashboard/subscription';

  constructor(private http: HttpClient,
    private logService: LogService,
    private authService: AuthService,
  ) { }

  getSubscriptionDetail(id: string): Observable<SubscriptionDetailReply> {
    const url = `${this.url}/${id}`;
    return this.http.get<SubscriptionDetailReply>(url, this.authService.getHttpOptions())
      .pipe(
        tap(_ => this.logService.info(`fetched subscription id=${id}`)),
        catchError(this.handleError<SubscriptionDetailReply>(`getSubscription id=${id}`))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      return of(result as T);
    };
  }
}
