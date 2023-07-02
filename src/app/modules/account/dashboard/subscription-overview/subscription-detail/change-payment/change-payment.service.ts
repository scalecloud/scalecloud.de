import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Observable, catchError, of } from 'rxjs';
import { ChangePaymentReply, ChangePaymentRequest } from './change-payment';

@Injectable({
  providedIn: 'root'
})
export class ChangePaymentService {

  private url = 'http://localhost:15000/dashboard/get-change-payment-setup-intent';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService) { }

  getChangePaymentSetupIntent(changePaymentRequest: ChangePaymentRequest): Observable<ChangePaymentReply> {
    return this.http.post<ChangePaymentReply>(this.url, changePaymentRequest, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<ChangePaymentReply>('getChangePaymentSetupIntent'))
      );
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.authService.getToken()
      })
    };
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.snackBarService.error(`Could change payment method. Please try again.`);
      return of(result as T);
    };
  }
}
