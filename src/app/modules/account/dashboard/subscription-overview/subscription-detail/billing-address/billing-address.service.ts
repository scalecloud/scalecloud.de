import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillingAddressReply, BillingAddressRequest, UpdateBillingAddressReply, UpdateBillingAddressRequest } from './billing-address-model';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class BillingAddressService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = inject(API_URL);
  private readonly urlBillingAddress = `${this.apiUrl}/dashboard/subscription/billing-address`;
  private readonly urlUpdateBillingAddress = `${this.apiUrl}/dashboard/subscription/update-billing-address`;

  getBillingAddress(request: BillingAddressRequest): Observable<BillingAddressReply> {
    return this.http.post<BillingAddressReply>(this.urlBillingAddress, request, this.authService.getHttpOptions());
  }

  updateBillingAddress(request: UpdateBillingAddressRequest): Observable<UpdateBillingAddressReply> {
    return this.http.post<UpdateBillingAddressReply>(this.urlUpdateBillingAddress, request, this.authService.getHttpOptions());
  }
}
