import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBillingPortal } from './billing-portal';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class BillingPortalService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);

  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/billing-portal`;

  getBillingPortal(): Observable<IBillingPortal> {
    return this.http.get<IBillingPortal>(this.url, this.auth.getHttpOptions());
  }

}
