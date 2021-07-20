import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NextcloudProduct } from './nextcloud-product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NextcloudProductService {

  private nextcloudProductsUrl = 'api/nextcloudproducts';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getNextcloudProducts(): Observable<NextcloudProduct[]> {
    return this.http.get<NextcloudProduct[]>(this.nextcloudProductsUrl)
      .pipe(
        catchError(this.handleError<NextcloudProduct[]>('getNextcloudProducts', []))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }


}