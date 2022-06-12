import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutModel } from './CheckoutModel';
import { ProductModel } from './ProductModel';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private url = 'http://localhost:15000/dashboard/create-checkout-session';

  constructor(private http: HttpClient, private logService: LogService, private authService: AuthService) { }

  getCheckoutSession(productModel: ProductModel): Observable<CheckoutModel> {
    return this.http.post<CheckoutModel>(this.url, productModel, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutModel>('getBillingPortal'))
      );
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Authorization': this.authService.getToken()
      })
    };
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
