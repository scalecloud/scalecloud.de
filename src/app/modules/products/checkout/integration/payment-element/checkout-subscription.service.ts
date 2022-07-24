import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutIntegrationRequest } from '../checkout-model-integration';
import { CheckoutSubscriptionModel } from './CheckoutSubscriptionModel';

@Injectable({
  providedIn: 'root'
})
export class CheckoutSubscriptionService {

  private url = 'http://localhost:15000/checkout/create-checkout-subscription';

  constructor(private http: HttpClient, private snackBarService: SnackBarService, private authService: AuthService) { }

  createCheckoutSubscription(checkoutIntegrationRequest: CheckoutIntegrationRequest): Observable<CheckoutSubscriptionModel> {
    return this.http.post<CheckoutSubscriptionModel>(this.url, checkoutIntegrationRequest, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutSubscriptionModel>('createCheckoutSubscription'))
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
      this.snackBarService.error(`Could not create checkout session. Please try again.`);
      return of(result as T);
    };
  }
}
