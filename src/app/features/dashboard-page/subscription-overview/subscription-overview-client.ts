import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';
import { SubscriptionOverviewModel } from './subscription-overview-model';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionOverviewClient {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);


  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscriptions`;

  getSubscriptionsOverview(): Observable<SubscriptionOverviewModel[]> {
    return this.http.get<SubscriptionOverviewModel[]>(this.url, this.auth.getHttpOptions());
  }

}
