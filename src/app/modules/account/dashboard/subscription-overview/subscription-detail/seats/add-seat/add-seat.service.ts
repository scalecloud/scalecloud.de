import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AddSeatRequest, AddSeatReply } from '../seats';

@Injectable({
  providedIn: 'root'
})
export class AddSeatService {

  private url = 'http://localhost:15000/dashboard/subscription/add-seat';
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  addSeat(addSeatRequest: AddSeatRequest): Observable<AddSeatReply> {
    return this.http.post<AddSeatReply>(this.url, addSeatRequest, this.authService.getHttpOptions());
  }

}
