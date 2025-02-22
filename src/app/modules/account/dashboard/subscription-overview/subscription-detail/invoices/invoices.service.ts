import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ListInvoicesReply, ListInvoicesRequest } from './invoices';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private url = 'http://localhost:15000/dashboard/subscription/invoices';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getInvoices(request: ListInvoicesRequest): Observable<ListInvoicesReply> {
    return this.http.post<ListInvoicesReply>(this.url, request, this.authService.getHttpOptions());
  }
}
