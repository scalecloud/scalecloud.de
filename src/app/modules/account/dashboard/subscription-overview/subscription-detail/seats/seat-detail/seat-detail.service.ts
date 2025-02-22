import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SeatDetailRequest, SeatDetailReply, UpdateSeatDetailRequest, UpdateSeatDetailReply, DeleteSeatRequest, DeleteSeatReply } from '../seats';

@Injectable({
  providedIn: 'root'
})
export class SeatDetailService {

  private readonly urlGetSeat = 'http://localhost:15000/dashboard/subscription/seat-detail';
  private readonly urlUpdateSeatDetail = 'http://localhost:15000/dashboard/subscription/update-seat';
  private readonly urlDeleteSeat = 'http://localhost:15000/dashboard/subscription/delete-seat';
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getSeat(seatDetailRequest: SeatDetailRequest): Observable<SeatDetailReply> {
    return this.http.post<SeatDetailReply>(this.urlGetSeat, seatDetailRequest, this.authService.getHttpOptions());
  }

  updateSeat(updateSeatDetailRequest: UpdateSeatDetailRequest): Observable<UpdateSeatDetailReply> {
    return this.http.post<UpdateSeatDetailReply>(this.urlUpdateSeatDetail, updateSeatDetailRequest, this.authService.getHttpOptions());
  }

  deleteSeat(deleteSeatRequest: DeleteSeatRequest): Observable<DeleteSeatReply> {
    return this.http.post<DeleteSeatReply>(this.urlDeleteSeat, deleteSeatRequest, this.authService.getHttpOptions());;
  }



}
