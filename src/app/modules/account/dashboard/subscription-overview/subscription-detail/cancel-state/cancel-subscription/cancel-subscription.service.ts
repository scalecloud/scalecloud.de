import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { API_URL } from 'src/app/core/config/api.token';
import { ISubscriptionCancelReply, ISubscriptionCancelRequest } from './subscription-cancel-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CancelSubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);


  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/cancel-subscription`;

  cancelSubscription(iSubscriptionCancelRequest: ISubscriptionCancelRequest): Observable<ISubscriptionCancelReply> {
    return this.http.post<ISubscriptionCancelReply>(this.url, iSubscriptionCancelRequest, this.authService.getHttpOptions());
  }

}
