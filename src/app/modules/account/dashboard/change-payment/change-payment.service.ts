import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';
import { API_URL } from 'src/app/core/config/api.token';

import { ChangePaymentReply } from './change-payment';

@Injectable({
  providedIn: 'root',
})
export class ChangePaymentService {
  private readonly apiUrl = inject(API_URL);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly url = `${this.apiUrl}/dashboard/get-change-payment-setup-intent`;

  getChangePaymentSetupIntent(): Observable<ChangePaymentReply> {
    return this.http.post<ChangePaymentReply>(
      this.url,
      null,
      this.authService.getHttpOptions(),
    );
  }
}