import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from '../checkout-create-subscription';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutSubscriptionService {

  private url = 'http://localhost:15000/checkout-integration/create-checkout-subscription';

  constructor(
    private http: HttpClient, 
    private snackBarService: SnackBarService, 
    private authService: AuthService,
    private logService: LogService,
    ) { }

  createCheckoutSubscription(checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest): Observable<CheckoutCreateSubscriptionReply> {
    return this.http.post<CheckoutCreateSubscriptionReply>(this.url, checkoutIntegrationRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutCreateSubscriptionReply>('createCheckoutSubscription'))
      );
  }


  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not create checkout session. Please try again.`);
      return of(result as T);
    };
  }
}
