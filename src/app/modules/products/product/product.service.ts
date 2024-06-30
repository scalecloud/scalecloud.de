import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { LogService } from 'src/app/shared/services/log/log.service';
import { NextcloudProduct } from '../nextcloud/nextcloud-product';
import { ProductTiersReply, ProductTiersRequest } from '../product-model';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = 'http://localhost:15000/product/tiers';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private logService: LogService,
  ) { }
  

  getProductTiers(request: ProductTiersRequest): Observable<ProductTiersReply> {
    return this.http.post<ProductTiersReply>(this.url, request, this.httpOptions)
      .pipe(
        catchError(this.handleError<ProductTiersReply>('getProductTiers'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      this.snackBarService.error(error.message || 'An error occurred');
      return of(result as T);
    };
  }
}
