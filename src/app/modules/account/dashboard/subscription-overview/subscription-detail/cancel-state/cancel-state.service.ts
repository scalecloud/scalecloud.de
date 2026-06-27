import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CancelStateReply } from './cancel-state';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class CancelStateService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription`;

  getCancelState(id: string): Observable<CancelStateReply> {
    const url = `${this.url}/${id}/cancel-state`;
    return this.http.get<CancelStateReply>(url, this.authService.getHttpOptions());
  }

}
