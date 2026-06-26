import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ListSeatReply, ListSeatRequest } from './seats';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class SeatsService {
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription/list-seats`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getListSeats(listSeatRequest: ListSeatRequest): Observable<ListSeatReply> {
    return this.http.post<ListSeatReply>(this.url, listSeatRequest, this.authService.getHttpOptions());
  }
}
