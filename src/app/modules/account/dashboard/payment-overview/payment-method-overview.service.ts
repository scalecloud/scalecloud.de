import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodOverviewService {

  private url = 'http://localhost:15000/dashboard/get-payment-method-overview';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getPaymentMethodOverview(): Observable<PaymentMethodOverviewReply> {
    return this.http.post<PaymentMethodOverviewReply>(this.url, null, this.authService.getHttpOptions());
  }
}
