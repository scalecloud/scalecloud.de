import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { IBillingPortal } from './billing-portal';

@Injectable({
  providedIn: 'root'
})
export class BillingPortalService {

  private url = 'http://localhost:15000/dashboard/billing-portal';

  constructor(private http: HttpClient, private logService: LogService, private authService: AuthService) { }

  getBillingPortal(): Observable<IBillingPortal> {
    return this.http.get<IBillingPortal>(this.url, this.getHttpOptions())
    .pipe(
      catchError(this.handleError<IBillingPortal>('getBillingPortal'))
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
