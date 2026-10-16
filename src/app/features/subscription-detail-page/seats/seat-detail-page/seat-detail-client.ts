import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api-token';
import { SeatDetailRequest, SeatDetailReply, UpdateSeatDetailRequest, UpdateSeatDetailReply, DeleteSeatRequest, DeleteSeatReply } from '../seats-model';

@Injectable({
  providedIn: 'root'
})
export class SeatDetailClient {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly urlGetSeat = `${this.apiUrl}/dashboard/subscription/seat-detail`;
  private readonly urlUpdateSeatDetail = `${this.apiUrl}/dashboard/subscription/update-seat`;
  private readonly urlDeleteSeat = `${this.apiUrl}/dashboard/subscription/delete-seat`;

  getSeat(seatDetailRequest: SeatDetailRequest): Observable<SeatDetailReply> {
    return this.http.post<SeatDetailReply>(this.urlGetSeat, seatDetailRequest);
  }

  updateSeat(updateSeatDetailRequest: UpdateSeatDetailRequest): Observable<UpdateSeatDetailReply> {
    return this.http.post<UpdateSeatDetailReply>(this.urlUpdateSeatDetail, updateSeatDetailRequest);
  }

  deleteSeat(deleteSeatRequest: DeleteSeatRequest): Observable<DeleteSeatReply> {
    return this.http.post<DeleteSeatReply>(this.urlDeleteSeat, deleteSeatRequest);;
  }



}
