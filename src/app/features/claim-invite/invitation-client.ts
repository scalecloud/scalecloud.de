import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../../core/config/api-token';
import { SKIP_SERVICE_ERROR_NOTIFICATION } from '../../core/interceptor/service-error-interceptor';
import { InvitationClaimReply, InvitationPreview, InvitationRequest } from './invitation-model';

@Injectable({ providedIn: 'root' })
export class InvitationClient {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly requestContext = new HttpContext().set(SKIP_SERVICE_ERROR_NOTIFICATION, true);

  preview(token: string): Observable<InvitationPreview> {
    return this.http.post<InvitationPreview>(
      `${this.apiUrl}/invitation/preview`,
      this.requestBody(token),
      { context: this.requestContext },
    );
  }

  claim(token: string): Observable<InvitationClaimReply> {
    return this.http.post<InvitationClaimReply>(
      `${this.apiUrl}/invitation/claim`,
      this.requestBody(token),
      { context: this.requestContext },
    );
  }

  private requestBody(token: string): InvitationRequest {
    return { token };
  }
}