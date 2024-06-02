import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ListSeatReply, ListSeatRequest } from './seats';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatsService {

  private url = 'http://localhost:15000/dashboard/subscription/list-seats';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  getListSeats(listSeatRequest: ListSeatRequest): Observable<ListSeatReply> {
    return this.http.post<ListSeatReply>(this.url, listSeatRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<ListSeatReply>('getListSeats'))
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
