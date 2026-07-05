import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api.token';
import { Auth } from 'src/app/core/auth/auth';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodOverviewService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/get-payment-method-overview`;

  getPaymentMethodOverview(): Observable<PaymentMethodOverviewReply> {
    return this.http.post<PaymentMethodOverviewReply>(this.url, null, this.auth.getHttpOptions());
  }
}