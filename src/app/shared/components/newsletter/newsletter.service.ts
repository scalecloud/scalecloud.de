import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsletterConfirmReply, NewsletterConfirmRequest, NewsletterSubscribeReply, NewsletterSubscribeRequest, NewsletterUnsubscribeReply, NewsletterUnsubscribeRequest } from './newsletter';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private readonly urlSubscribe = 'http://localhost:15000/newsletter/subscribe';
  private readonly urlConfirm = 'http://localhost:15000/newsletter/confirm';
  private readonly urlUnsubscribe = 'http://localhost:15000/newsletter/unsubscribe';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private readonly http: HttpClient,
  ) { }

  subscribeToNewsletter(request: NewsletterSubscribeRequest): Observable<NewsletterSubscribeReply> {
    return this.http.post<NewsletterSubscribeReply>(this.urlSubscribe, request, this.httpOptions);
  }

  confirmNewsletterEMail(request: NewsletterConfirmRequest): Observable<NewsletterConfirmReply> {
    return this.http.post<NewsletterConfirmReply>(this.urlConfirm, request, this.httpOptions);
  }

  unsubscribeFromNewsletter(request: NewsletterUnsubscribeRequest): Observable<NewsletterUnsubscribeReply> {
    return this.http.post<NewsletterUnsubscribeReply>(this.urlUnsubscribe, request, this.httpOptions);
  }

}
