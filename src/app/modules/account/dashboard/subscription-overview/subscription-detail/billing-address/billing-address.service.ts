import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BillingAddressReply, BillingAddressRequest } from './billing-address-model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BillingAddressService {

  private urlBillingAddress = 'http://localhost:15000/dashboard/subscription/billing-address';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getBillingAddress(request: BillingAddressRequest): Observable<BillingAddressReply> {
    return this.http.post<BillingAddressReply>(this.urlBillingAddress, request, this.authService.getHttpOptions());
  }
}
