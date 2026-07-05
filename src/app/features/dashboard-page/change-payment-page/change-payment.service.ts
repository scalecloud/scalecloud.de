import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChangePaymentReply } from './change-payment';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root',
})
export class ChangePaymentService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);

  getChangePaymentSetupIntent(): Observable<ChangePaymentReply> {
    return this.http.post<ChangePaymentReply>(
      `${this.apiUrl}/dashboard/get-change-payment-setup-intent`,
      null,
      this.auth.getHttpOptions(),
    );
  }
}