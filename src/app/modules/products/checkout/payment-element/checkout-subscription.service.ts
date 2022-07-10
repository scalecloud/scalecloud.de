import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ProductModel } from '../ProductModel';
import { CheckoutSubscriptionModel } from './CheckoutSubscriptionModel';

@Injectable({
  providedIn: 'root'
})
export class CheckoutSubscriptionService {

  private url = 'http://localhost:15000/dashboard/create-checkout-subscription';

  constructor(private http: HttpClient, private logService: LogService, private authService: AuthService) { }

  createCheckoutSubscription(productModel: ProductModel): Observable<CheckoutSubscriptionModel> {
    return this.http.post<CheckoutSubscriptionModel>(this.url, productModel, this.getHttpOptions())
      .pipe(
        catchError(this.handleError<CheckoutSubscriptionModel>('createCheckoutSubscription'))
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
