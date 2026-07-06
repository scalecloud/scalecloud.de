import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class ResumeSubscriptionClient {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly apiUrl = inject(API_URL);

  private readonly url = `${this.apiUrl}/dashboard/resume-subscription`;

  resumeSubscription(request: ISubscriptionResumeRequest): Observable<ISubscriptionResumeReply> {
    return this.http.post<ISubscriptionResumeReply>(
      this.url,
      request,
      this.auth.getHttpOptions(),
    );
  }
}