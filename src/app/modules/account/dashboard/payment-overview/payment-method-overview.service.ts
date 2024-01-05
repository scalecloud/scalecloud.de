import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { Observable, catchError, of } from 'rxjs';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodOverviewService {

  private url = 'http://localhost:15000/dashboard/get-payment-method-overview';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
    ) { }

  getPaymentMethodOverview(): Observable<PaymentMethodOverviewReply> {
    return this.http.post<PaymentMethodOverviewReply>(this.url, null, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<PaymentMethodOverviewReply>('getPaymentMethodOverview'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not get default payment method. Please try again.`);
      return of(result as T);
    };
  }
}
