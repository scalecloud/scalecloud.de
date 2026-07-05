import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ListSeatReply, ListSeatRequest } from './seats';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api.token';
import { Auth } from 'src/app/core/auth/auth';

@Injectable({
  providedIn: 'root'
})
export class SeatsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);

  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription/list-seats`;

  getListSeats(listSeatRequest: ListSeatRequest): Observable<ListSeatReply> {
    return this.http.post<ListSeatReply>(this.url, listSeatRequest, this.auth.getHttpOptions());
  }
}
