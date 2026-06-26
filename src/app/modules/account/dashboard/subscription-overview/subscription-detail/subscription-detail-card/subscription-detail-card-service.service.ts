import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubscriptionDetailReply } from './subscription-detail-card';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailCardServiceService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription`;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  getSubscriptionDetail(id: string): Observable<SubscriptionDetailReply> {
    const url = `${this.url}/${id}`;
    return this.http.get<SubscriptionDetailReply>(url, this.authService.getHttpOptions());
  }
}