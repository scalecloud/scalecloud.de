import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddUserRequest, AddUserReply } from '../users';

@Injectable({
  providedIn: 'root'
})
export class AddUserService {

  private url = 'http://localhost:15000/dashboard/subscription/add-user';
  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
  ) { }

  addUser(addUserRequest: AddUserRequest): Observable<AddUserReply> {
    return this.http.post<AddUserReply>(this.url, addUserRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<AddUserReply>('addUser'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not add user. Please try again later.`);
      return of(result as T);
    };
  }
}
