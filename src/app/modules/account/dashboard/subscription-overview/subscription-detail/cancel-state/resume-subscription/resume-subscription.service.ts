import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class ResumeSubscriptionService {
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/resume-subscription`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    ) { }

  resumeSubscription(iSubscriptionResumeRequest: ISubscriptionResumeRequest): Observable<ISubscriptionResumeReply> {
    return this.http.post<ISubscriptionResumeReply>(this.url, iSubscriptionResumeRequest, this.authService.getHttpOptions());
  }

}
