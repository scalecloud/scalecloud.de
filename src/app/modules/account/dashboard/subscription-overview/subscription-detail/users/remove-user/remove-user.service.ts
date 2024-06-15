import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { RemoveUserRequest, RemoveUserReply } from '../users';

@Injectable({
  providedIn: 'root'
})
export class RemoveUserService {

  private url = 'http://localhost:15000/dashboard/users/remove-user';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  removeUser(removeUserRequest: RemoveUserRequest): Observable<RemoveUserReply> {
    return this.http.post<RemoveUserReply>(this.url, removeUserRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<RemoveUserReply>('removeUser'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not remove user. Please try again later.`);
      return of(result as T);
    };
  }
}
