import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SeatDetailRequest, SeatDetailReply, UpdateSeatDetailRequest, UpdateSeatDetailReply, DeleteSeatRequest, DeleteSeatReply } from '../seats';

@Injectable({
  providedIn: 'root'
})
export class SeatDetailService {

  private urlGetSeat = 'http://localhost:15000/dashboard/subscription/seat-detail';
  private urlUpdateSeatDetail = 'http://localhost:15000/dashboard/subscription/update-seat';
  private urlDeleteSeat = 'http://localhost:15000/dashboard/seats/delete-seat';
  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  getSeat(seatDetailRequest: SeatDetailRequest): Observable<SeatDetailReply> {
    return this.http.post<SeatDetailReply>(this.urlGetSeat, seatDetailRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<SeatDetailReply>('getSeatDetail'))
      );
  }

  updateSeat(updateSeatDetailRequest: UpdateSeatDetailRequest): Observable<UpdateSeatDetailReply> {
    return this.http.post<UpdateSeatDetailReply>(this.urlUpdateSeatDetail, updateSeatDetailRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<SeatDetailReply>('updateSeat'))
      );
  }

  deleteSeat(deleteSeatRequest: DeleteSeatRequest): Observable<DeleteSeatReply> {
    return this.http.post<DeleteSeatReply>(this.urlDeleteSeat, deleteSeatRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<DeleteSeatReply>('deleteSeat'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not add seat. Please try again later.`);
      return of(result as T);
    };
  }
}
