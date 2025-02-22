import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { ChangePaymentReply } from './change-payment';

@Injectable({
  providedIn: 'root'
})
export class ChangePaymentService {

  private url = 'http://localhost:15000/dashboard/get-change-payment-setup-intent';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    ) { }

  getChangePaymentSetupIntent(): Observable<ChangePaymentReply> {
    return this.http.post<ChangePaymentReply>(this.url, null, this.authService.getHttpOptions());
  }

}
