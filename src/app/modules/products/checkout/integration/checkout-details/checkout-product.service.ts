import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutProductReply } from '../product/checkout-product-reply';
import { CheckoutProductRequest } from '../product/checkout-product-request';

@Injectable({
  providedIn: 'root'
})
export class CheckoutProductService {

  private url = 'http://localhost:15000/checkout-integration/get-checkout-product';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService) { }

  getCheckoutProduct(checkoutProductRequest: CheckoutProductRequest): Observable<CheckoutProductReply> {
    return this.http.post<CheckoutProductReply>(this.url, checkoutProductRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutProductReply>('getCheckoutProduct'))
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
