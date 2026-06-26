import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionCancelReply, ISubscriptionCancelRequest } from './subscription-cancel-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CancelSubscriptionService {

  private readonly url = 'http://localhost:15000/dashboard/cancel-subscription';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  cancelSubscription(iSubscriptionCancelRequest: ISubscriptionCancelRequest): Observable<ISubscriptionCancelReply> {
    return this.http.post<ISubscriptionCancelReply>(this.url, iSubscriptionCancelRequest, this.authService.getHttpOptions());
  }

}
