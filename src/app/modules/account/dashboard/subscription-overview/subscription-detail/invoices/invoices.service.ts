import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ListInvoicesReply, ListInvoicesRequest } from './invoices';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/subscription/invoices`;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  getInvoices(request: ListInvoicesRequest): Observable<ListInvoicesReply> {
    return this.http.post<ListInvoicesReply>(this.url, request, this.authService.getHttpOptions());
  }
}
