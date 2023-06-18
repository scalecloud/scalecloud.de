import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SubscriptionPaymentMethodReply, SubscriptionPaymentMethodRequest } from './subscription-payment-method';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPaymentMethodService {

  private url = 'http://localhost:15000/dashboard/getPaymentMethod';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService) { }

  getSubscriptionPaymentMethod(subscriptionPaymentMethodRequest: SubscriptionPaymentMethodRequest): Observable<SubscriptionPaymentMethodReply> {
    return this.http.post<SubscriptionPaymentMethodReply>(this.url, subscriptionPaymentMethodRequest, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<SubscriptionPaymentMethodReply>('resumeSubscription'))
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
      this.snackBarService.error(`Could not get default payment method. Please try again.`);
      return of(result as T);
    };
  }
}
