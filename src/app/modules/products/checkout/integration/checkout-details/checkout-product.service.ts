import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutProductReply } from './checkout-product-reply';
import { CheckoutProductRequest } from './checkout-product-request';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutProductService {

  private url = 'http://localhost:15000/checkout-integration/get-checkout-product';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  getCheckoutProduct(checkoutProductRequest: CheckoutProductRequest): Observable<CheckoutProductReply> {
    return this.http.post<CheckoutProductReply>(this.url, checkoutProductRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutProductReply>('getCheckoutProduct'))
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
