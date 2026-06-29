import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubscriptionDetailReply } from './subscription-detail-card';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailCardService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription`;

  getSubscriptionDetail(id: string): Observable<SubscriptionDetailReply> {
    const url = `${this.url}/${id}`;
    return this.http.get<SubscriptionDetailReply>(url, this.authService.getHttpOptions());
  }
}