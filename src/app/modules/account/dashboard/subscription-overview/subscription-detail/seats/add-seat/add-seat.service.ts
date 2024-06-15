import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddSeatRequest, AddSeatReply } from '../seats';

@Injectable({
  providedIn: 'root'
})
export class AddSeatService {

  private url = 'http://localhost:15000/dashboard/subscription/add-seat';
  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  addSeat(addSeatRequest: AddSeatRequest): Observable<AddSeatReply> {
    return this.http.post<AddSeatReply>(this.url, addSeatRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<AddSeatReply>('addSeat'))
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
