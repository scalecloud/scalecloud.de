import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutIntegrationReply, CheckoutIntegrationRequest } from '../checkout-model-integration';

@Injectable({
  providedIn: 'root'
})
export class CheckoutSubscriptionService {

  private url = 'http://localhost:15000/checkout-integration/create-checkout-subscription';

  constructor(
    private http: HttpClient, 
    private snackBarService: SnackBarService, 
    private authService: AuthService) { }

  createCheckoutSubscription(checkoutIntegrationRequest: CheckoutIntegrationRequest): Observable<CheckoutIntegrationReply> {
    return this.http.post<CheckoutIntegrationReply>(this.url, checkoutIntegrationRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutIntegrationReply>('createCheckoutSubscription'))
      );
  }


  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.snackBarService.error(`Could not create checkout session. Please try again.`);
      return of(result as T);
    };
  }
}
