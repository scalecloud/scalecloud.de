import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionCancelReply, ISubscriptionCancelRequest } from './subscription-cancel-request';

@Injectable({
  providedIn: 'root'
})
export class CancelSubscriptionService {

  private url = 'http://localhost:15000/dashboard/cancel-subscription';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  cancelSubscription(iSubscriptionCancelRequest: ISubscriptionCancelRequest): Observable<ISubscriptionCancelReply> {
    return this.http.post<ISubscriptionCancelReply>(this.url, iSubscriptionCancelRequest, this.authService.getHttpOptions());
  }

}
