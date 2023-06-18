import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Observable, catchError, of } from 'rxjs';
import { SubscriptionSetupIntentReply, SubscriptionSetupIntentRequest } from './change-payment';

@Injectable({
  providedIn: 'root'
})
export class ChangePaymentService {

  private url = 'http://localhost:15000/dashboard/change-subscription-payment-method';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService) { }

  getSubscriptionSetupIntent(subscriptionSetupIntentRequest: SubscriptionSetupIntentRequest): Observable<SubscriptionSetupIntentReply> {
    return this.http.post<SubscriptionSetupIntentReply>(this.url, subscriptionSetupIntentRequest, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<SubscriptionSetupIntentReply>('getSubscriptionPaymentMethod'))
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
      this.snackBarService.error(`Could change payment method. Please try again.`);
      return of(result as T);
    };
  }
}
