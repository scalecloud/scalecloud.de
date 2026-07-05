import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsletterConfirmReply, NewsletterConfirmRequest, NewsletterSubscribeReply, NewsletterSubscribeRequest, NewsletterUnsubscribeReply, NewsletterUnsubscribeRequest } from './newsletter-model';
import { API_URL } from 'src/app/core/config/api-token';

@Injectable({
  providedIn: 'root'
})
export class Newsletter {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = inject(API_URL);
  private readonly urlSubscribe = `${this.apiUrl}/newsletter/subscribe`;
  private readonly urlConfirm = `${this.apiUrl}/newsletter/confirm`;
  private readonly urlUnsubscribe = `${this.apiUrl}/newsletter/unsubscribe`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

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
