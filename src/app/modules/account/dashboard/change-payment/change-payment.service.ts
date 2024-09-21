import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Observable, catchError, of } from 'rxjs';
import { ChangePaymentReply } from './change-payment';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePaymentService {

  private url = 'http://localhost:15000/dashboard/get-change-payment-setup-intent';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    ) { }

  getChangePaymentSetupIntent(): Observable<ChangePaymentReply> {
    return this.http.post<ChangePaymentReply>(this.url, null, this.authService.getHttpOptions());
  }

}
