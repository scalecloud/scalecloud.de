import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeSubscriptionService {

  private url = 'http://localhost:15000/dashboard/resume-subscription';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    ) { }

  resumeSubscription(iSubscriptionResumeRequest: ISubscriptionResumeRequest): Observable<ISubscriptionResumeReply> {
    return this.http.post<ISubscriptionResumeReply>(this.url, iSubscriptionResumeRequest, this.authService.getHttpOptions());
  }

}
