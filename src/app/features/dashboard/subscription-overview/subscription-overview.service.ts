import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscriptionOverview } from './subscription-overview';
import { API_URL } from 'src/app/core/config/api.token';
import { Auth } from 'src/app/core/auth/auth';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionOverviewService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);


  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscriptions`;

  getSubscriptionsOverview(): Observable<ISubscriptionOverview[]> {
    return this.http.get<ISubscriptionOverview[]>(this.url, this.auth.getHttpOptions());
  }

}
