import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddSeatRequest, AddSeatReply } from '../seats-model';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root',
})
export class AddSeatClient {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly apiUrl = inject(API_URL);

  private readonly url = `${this.apiUrl}/dashboard/subscription/add-seat`;

  addSeat(request: AddSeatRequest): Observable<AddSeatReply> {
    return this.http.post<AddSeatReply>(
      this.url,
      request,
      this.auth.getHttpOptions(),
    );
  }
}