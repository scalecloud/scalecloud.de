import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillingAddressReply, BillingAddressRequest, UpdateBillingAddressReply, UpdateBillingAddressRequest } from './billing-address-model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BillingAddressService {

  private readonly urlBillingAddress = 'http://localhost:15000/dashboard/subscription/billing-address';
  private readonly urlUpdateBillingAddress = 'http://localhost:15000/dashboard/subscription/update-billing-address';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getBillingAddress(request: BillingAddressRequest): Observable<BillingAddressReply> {
    return this.http.post<BillingAddressReply>(this.urlBillingAddress, request, this.authService.getHttpOptions());
  }

  updateBillingAddress(request: UpdateBillingAddressRequest): Observable<UpdateBillingAddressReply> {
    return this.http.post<UpdateBillingAddressReply>(this.urlUpdateBillingAddress, request, this.authService.getHttpOptions());
  }
}
