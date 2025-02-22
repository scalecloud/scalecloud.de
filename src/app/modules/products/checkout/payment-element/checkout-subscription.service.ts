import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from '../checkout-create-subscription';

@Injectable({
  providedIn: 'root'
})
export class CheckoutSubscriptionService {

  private url = 'http://localhost:15000/checkout-integration/create-checkout-subscription';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    ) { }

  createCheckoutSubscription(checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest): Observable<CheckoutCreateSubscriptionReply> {
    return this.http.post<CheckoutCreateSubscriptionReply>(this.url, checkoutIntegrationRequest, this.authService.getHttpOptions());
  }

}
