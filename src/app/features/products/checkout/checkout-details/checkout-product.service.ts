import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CheckoutProductReply, CheckoutProductRequest } from './checkout-product';
import { API_URL } from 'src/app/core/config/api.token';

@Service()
export class CheckoutProductService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/checkout-integration/get-checkout-product`;

  getCheckoutProduct(checkoutProductRequest: CheckoutProductRequest): Observable<CheckoutProductReply> {
    return this.http.post<CheckoutProductReply>(this.url, checkoutProductRequest, this.authService.getHttpOptions());
  }

}