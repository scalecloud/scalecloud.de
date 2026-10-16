import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ListInvoicesReply, ListInvoicesRequest } from './invoices-model';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class InvoicesClient {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription/invoices`;

  getInvoices(request: ListInvoicesRequest): Observable<ListInvoicesReply> {
    return this.http.post<ListInvoicesReply>(this.url, request);
  }
}