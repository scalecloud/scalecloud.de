import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutProductReply, CheckoutProductRequest } from './checkout-product';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutProductService {

  private url = 'http://localhost:15000/checkout-integration/get-checkout-product';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getCheckoutProduct(checkoutProductRequest: CheckoutProductRequest): Observable<CheckoutProductReply> {
    return this.http.post<CheckoutProductReply>(this.url, checkoutProductRequest, this.authService.getHttpOptions());
  }

}
