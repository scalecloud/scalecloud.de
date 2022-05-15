import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ISubscription } from './subscription';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  // private url = 'api.scalecloud.de/dashboard/subscriptions';
  private url = 'http://localhost:15000/dashboard/subscriptions';

  private subscriptionUrl = 'http://localhost:15000/dashboard/subscription';

  constructor(private http: HttpClient, private logService: LogService, private authService: AuthService) { }

  getSubscription(id: string): Observable<ISubscription> {
    const url = `${this.subscriptionUrl}/${id}`;
    return this.http.get<ISubscription>(url).pipe(
      tap(_ => this.logService.info(`fetched subscription id=${id}`)),
      catchError(this.handleError<ISubscription>(`getDashboard id=${id}`))
    );
  }

  getSubscriptions(): Observable<ISubscription[]> {
    return this.http.get<ISubscription[]>(this.url, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<ISubscription[]>('getSubscriptions', []))
      );
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.authService.getToken()
      })
    };
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
