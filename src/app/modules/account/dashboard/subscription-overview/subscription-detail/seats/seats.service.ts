import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ListSeatReply, ListSeatRequest } from './seats';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatsService {

  private url = 'http://localhost:15000/dashboard/subscription/list-seats';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getListSeats(listSeatRequest: ListSeatRequest): Observable<ListSeatReply> {
    return this.http.post<ListSeatReply>(this.url, listSeatRequest, this.authService.getHttpOptions());
  }
}
