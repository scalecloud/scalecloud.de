import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Observable, catchError, of } from 'rxjs';
import { ListUserReply, ListUserRequest } from './users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = 'http://localhost:15000/dashboard/subscription/list-users';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  getListUsers(listUserRequest: ListUserRequest): Observable<ListUserReply> {
    return this.http.post<ListUserReply>(this.url, listUserRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<ListUserReply>('getListUsers'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not get list of users. Please try again later.`);
      return of(result as T);
    };
  }
}
