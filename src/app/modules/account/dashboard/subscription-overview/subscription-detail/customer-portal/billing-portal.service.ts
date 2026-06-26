import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { IBillingPortal } from './billing-portal';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class BillingPortalService {
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/dashboard/billing-portal`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getBillingPortal(): Observable<IBillingPortal> {
    return this.http.get<IBillingPortal>(this.url, this.authService.getHttpOptions());
  }

}
