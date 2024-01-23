import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddSeatReply, AddSeatRequest, RemoveSeatReply, RemoveSeatRequest, SeatListReply, SeatListRequest } from './seats';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatsService {

  private url = 'http://localhost:15000/dashboard/get-checkout-product';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  getSeatsList(seatListRequest: SeatListRequest): Observable<SeatListReply> {
    return this.http.post<SeatListReply>(this.url, seatListRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<SeatListReply>('getUserList'))
      );
  }





  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not create checkout session. Please try again.`);
      return of(result as T);
    };
  }
}
