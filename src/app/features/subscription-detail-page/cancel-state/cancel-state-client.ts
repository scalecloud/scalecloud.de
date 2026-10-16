import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CancelStateReply } from './cancel-state-model';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class CancelStateClient {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription`;

  getCancelState(id: string): Observable<CancelStateReply> {
    const url = `${this.url}/${id}/cancel-state`;
    return this.http.get<CancelStateReply>(url);
  }

}
