import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodOverviewService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/get-payment-method-overview`;

  getPaymentMethodOverview(): Observable<PaymentMethodOverviewReply> {
    return this.http.post<PaymentMethodOverviewReply>(this.url, null, this.authService.getHttpOptions());
  }
}