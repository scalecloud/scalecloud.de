import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';
import { SubscriptionDetailReply } from './subscription-detail-card-model';

@Injectable({ providedIn: 'root' })
export class SubscriptionDetailCardClient {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly baseUrl = `${inject(API_URL)}/dashboard/subscription`;

  getSubscriptionDetail(id: string): Observable<SubscriptionDetailReply> {
    return this.http.get<SubscriptionDetailReply>(
      `${this.baseUrl}/${id}`,
      this.auth.getHttpOptions(),
    );
  }
}