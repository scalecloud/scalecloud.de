import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from '../checkout-create-subscription';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class CheckoutSubscriptionClient {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/checkout-integration/create-checkout-subscription`;

  createCheckoutSubscription(checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest): Observable<CheckoutCreateSubscriptionReply> {
    return this.http.post<CheckoutCreateSubscriptionReply>(this.url, checkoutIntegrationRequest);
  }

}
