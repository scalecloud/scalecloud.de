import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ISubscriptionDetail } from './subscription-detail';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailService {

  private url = 'http://localhost:15000/dashboard/subscription';

  constructor(private http: HttpClient,
    private logService: LogService,
    private authService: AuthService,
  ) { }

  getSubscriptionDetail(id: string): Observable<ISubscriptionDetail> {
    const url = `${this.url}/${id}`;
    return this.http.get<ISubscriptionDetail>(url, this.authService.getHttpOptions())
      .pipe(
        tap(_ => this.logService.info(`fetched subscription id=${id}`)),
        catchError(this.handleError<ISubscriptionDetail>(`getSubscription id=${id}`))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      return of(result as T);
    };
  }
}
