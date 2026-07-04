import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SubscriptionDetailReply } from './subscription-detail-card';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({ providedIn: 'root' })
export class SubscriptionDetailCardService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${inject(API_URL)}/dashboard/subscription`;

  getSubscriptionDetail(id: string): Observable<SubscriptionDetailReply> {
    return this.http.get<SubscriptionDetailReply>(
      `${this.baseUrl}/${id}`,
      this.authService.getHttpOptions(),
    );
  }
}