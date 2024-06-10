import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { RemoveSeatRequest, RemoveSeatReply } from '../seats';

@Injectable({
  providedIn: 'root'
})
export class RemoveSeatService {

  private url = 'http://localhost:15000/dashboard/seats/remove-seat';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  removeSeat(removeSeatRequest: RemoveSeatRequest): Observable<RemoveSeatReply> {
    return this.http.post<RemoveSeatReply>(this.url, removeSeatRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<RemoveSeatReply>('removeSeat'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not remove seat. Please try again later.`);
      return of(result as T);
    };
  }
}
