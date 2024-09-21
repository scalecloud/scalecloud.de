import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ISubscriptionOverview } from './subscription-overview';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionOverviewService {

  // private url = 'api.scalecloud.de/dashboard/subscriptions';
  private url = 'http://localhost:15000/dashboard/subscriptions';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getSubscriptionsOverview(): Observable<ISubscriptionOverview[]> {
    return this.http.get<ISubscriptionOverview[]>(this.url, this.authService.getHttpOptions());
  }

}
