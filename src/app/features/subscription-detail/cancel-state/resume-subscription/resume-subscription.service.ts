import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api.token';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';

@Service()
export class ResumeSubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = inject(API_URL);

  private readonly url = `${this.apiUrl}/dashboard/resume-subscription`;

  resumeSubscription(request: ISubscriptionResumeRequest): Observable<ISubscriptionResumeReply> {
    return this.http.post<ISubscriptionResumeReply>(
      this.url,
      request,
      this.authService.getHttpOptions(),
    );
  }
}