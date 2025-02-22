import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubscriptionDetailReply } from './subscription-detail-card';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailCardServiceService {

  private url = 'http://localhost:15000/dashboard/subscription';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getSubscriptionDetail(id: string): Observable<SubscriptionDetailReply> {
    const url = `${this.url}/${id}`;
    return this.http.get<SubscriptionDetailReply>(url, this.authService.getHttpOptions());
  }
}