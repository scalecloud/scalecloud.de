import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SynologyProduct } from './synology-product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class SynologyProductService {

  private synologyProductsUrl = 'api/synologyproducts';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private logService: LogService,
  ) { }

  getSynologyProducts(): Observable<SynologyProduct[]> {
    return this.http.get<SynologyProduct[]>(this.synologyProductsUrl)
      .pipe(
        catchError(this.handleError<SynologyProduct[]>('getSynologyProducts', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      return of(result as T);
    };
  }

}