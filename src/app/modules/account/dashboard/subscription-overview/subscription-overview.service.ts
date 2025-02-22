import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionOverview } from './subscription-overview';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionOverviewService {

  private readonly url = 'http://localhost:15000/dashboard/subscriptions';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }

  getSubscriptionsOverview(): Observable<ISubscriptionOverview[]> {
    return this.http.get<ISubscriptionOverview[]>(this.url, this.authService.getHttpOptions());
  }

}
