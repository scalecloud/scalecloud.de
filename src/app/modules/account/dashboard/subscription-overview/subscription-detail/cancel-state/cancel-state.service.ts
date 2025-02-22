import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CancelStateReply } from './cancel-state';

@Injectable({
  providedIn: 'root'
})
export class CancelStateService {

  private readonly url = 'http://localhost:15000/dashboard/subscription';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) { }

  getCancelState(id: string): Observable<CancelStateReply> {
    const url = `${this.url}/${id}/cancel-state`;
    return this.http.get<CancelStateReply>(url, this.authService.getHttpOptions());
  }

}
