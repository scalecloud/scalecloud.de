import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { IBillingPortal } from './billing-portal';

@Injectable({
  providedIn: 'root'
})
export class BillingPortalService {

  private url = 'http://localhost:15000/dashboard/billing-portal';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  getBillingPortal(): Observable<IBillingPortal> {
    return this.http.get<IBillingPortal>(this.url, this.authService.getHttpOptions());
  }

}
