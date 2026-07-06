import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BillingAddressReply, BillingAddressRequest, UpdateBillingAddressReply, UpdateBillingAddressRequest } from './billing-address-model';
import { Observable } from 'rxjs/internal/Observable';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class BillingAddressClient {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);

  private readonly apiUrl = inject(API_URL);
  private readonly urlBillingAddress = `${this.apiUrl}/dashboard/subscription/billing-address`;
  private readonly urlUpdateBillingAddress = `${this.apiUrl}/dashboard/subscription/update-billing-address`;

  getBillingAddress(request: BillingAddressRequest): Observable<BillingAddressReply> {
    return this.http.post<BillingAddressReply>(this.urlBillingAddress, request, this.auth.getHttpOptions());
  }

  updateBillingAddress(request: UpdateBillingAddressRequest): Observable<UpdateBillingAddressReply> {
    return this.http.post<UpdateBillingAddressReply>(this.urlUpdateBillingAddress, request, this.auth.getHttpOptions());
  }
}
