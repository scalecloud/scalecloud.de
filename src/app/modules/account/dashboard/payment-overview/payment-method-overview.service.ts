import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { Observable, catchError, of } from 'rxjs';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodOverviewService {

  private url = 'http://localhost:15000/dashboard/get-payment-method-overview';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getPaymentMethodOverview(): Observable<PaymentMethodOverviewReply> {
    return this.http.post<PaymentMethodOverviewReply>(this.url, null, this.authService.getHttpOptions());
  }
}
