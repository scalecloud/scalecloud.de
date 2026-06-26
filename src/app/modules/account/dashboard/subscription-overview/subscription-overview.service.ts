import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionOverview } from './subscription-overview';
import { API_URL } from 'src/app/core/config/api.token';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionOverviewService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);


  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscriptions`;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  getSubscriptionsOverview(): Observable<ISubscriptionOverview[]> {
    return this.http.get<ISubscriptionOverview[]>(this.url, this.authService.getHttpOptions());
  }

}
