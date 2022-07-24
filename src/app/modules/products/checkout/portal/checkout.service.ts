import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutModelPortalRequest, CheckoutModelPortalReturn } from './checkout-model-portal';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private url = 'http://localhost:15000/checkout/create-checkout-session';

  constructor(private http: HttpClient, 
    private logService: LogService, 
    private authService: AuthService,
    private snackBarService: SnackBarService
    ) { }

  getCheckoutSession(checkoutModelPortalRequest: CheckoutModelPortalRequest): Observable<CheckoutModelPortalReturn> {
    return this.http.post<CheckoutModelPortalReturn>(this.url, checkoutModelPortalRequest, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutModelPortalReturn>('getBillingPortal'))
        
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
      this.snackBarService.error("Checkout session could not be started. Please try again.");
      return of(result as T);
    };
  }

}
