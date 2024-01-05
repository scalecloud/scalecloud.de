import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NextcloudProduct } from './nextcloud-product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { LogService } from 'src/app/shared/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class NextcloudProductService {

  private nextcloudProductsUrl = 'api/nextcloudproducts';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private logService: LogService,
    ) { }

  getNextcloudProducts(): Observable<NextcloudProduct[]> {
    return this.http.get<NextcloudProduct[]>(this.nextcloudProductsUrl)
      .pipe(
        catchError(this.handleError<NextcloudProduct[]>('getNextcloudProducts', []))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logService.error(error);
      return of(result as T);
    };
  }


}