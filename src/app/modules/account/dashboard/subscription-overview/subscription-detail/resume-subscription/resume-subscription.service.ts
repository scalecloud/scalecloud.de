import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';
import { Observable, catchError, of } from 'rxjs';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeSubscriptionService {

  private url = 'http://localhost:15000/dashboard/resume-subscription';

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private logService: LogService,
    ) { }

  resumeSubscription(iSubscriptionResumeRequest: ISubscriptionResumeRequest): Observable<ISubscriptionResumeReply> {
    return this.http.post<ISubscriptionResumeReply>(this.url, iSubscriptionResumeRequest, this.authService.getHttpOptions())
      .pipe(
        catchError(this.handleError<ISubscriptionResumeReply>('resumeSubscription'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(`Could not resume subscription. Please try again.`);
      return of(result as T);
    };
  }
}
