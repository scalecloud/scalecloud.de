import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SubscriptionCancelReply, SubscriptionCancelRequest } from './subscription-cancel-request-model';
import { Observable } from 'rxjs';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class CancelSubscriptionClient {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);


  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/cancel-subscription`;

  cancelSubscription(iSubscriptionCancelRequest: SubscriptionCancelRequest): Observable<SubscriptionCancelReply> {
    return this.http.post<SubscriptionCancelReply>(this.url, iSubscriptionCancelRequest, this.auth.getHttpOptions());
  }

}
