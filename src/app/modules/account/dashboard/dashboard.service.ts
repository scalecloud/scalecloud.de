import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logger } from '@firebase/logger';
import { catchError, Observable, of } from 'rxjs';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ISubscription } from './subscription';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  

 // private url = 'api.scalecloud.de/dashboard/subscriptions';
   private url = 'http://localhost:15000/albums';

  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin:': '*',
      'Content-Type': 'application/json',
   //   'Authorization': 'Basic ' + btoa('username:password')
     })
  };
 
  constructor(private http: HttpClient, private logService: LogService) { }

  getSubscriptions(): Observable<ISubscription[]> {
    return this.http.get<ISubscription[]>(this.url)
      .pipe(
        catchError(this.handleError<ISubscription[]>('getSubscriptions', []))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
