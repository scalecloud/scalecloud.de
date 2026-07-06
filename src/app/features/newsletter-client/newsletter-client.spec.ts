import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  NewsletterConfirmReply,
  NewsletterSubscribeReply,
  NewsletterSubscribeReplyStatus,
  NewsletterUnsubscribeReply,
  NewsletterUnsubscribeReplyStatus,
} from './newsletter-model';
import { API_URL } from 'src/app/core/config/api-token';
import { NewsletterClient } from './newsletter-client';

const apiUrl = 'https://api.example.com';

describe('NewsletterClient', () => {
  let service: NewsletterClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    });

    service = TestBed.inject(NewsletterClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to /newsletter/subscribe with the E-Mail address', () => {
    const reply: NewsletterSubscribeReply = {
      newsletterSubscribeReplyStatus: NewsletterSubscribeReplyStatus.SUCCESS,
      email: 'user@example.com',
    };

    service.subscribeToNewsletter({ email: 'user@example.com' }).subscribe(result => {
      expect(result).toEqual(reply);
    });

    const req = httpMock.expectOne(`${apiUrl}/newsletter/subscribe`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@example.com' });
    req.flush(reply);
  });

  it('should POST to /newsletter/confirm with the verification token', () => {
    const reply: NewsletterConfirmReply = { confirmed: true };

    service.confirmNewsletterEMail({ verificationToken: 'token-123' }).subscribe(result => {
      expect(result).toEqual(reply);
    });

    const req = httpMock.expectOne(`${apiUrl}/newsletter/confirm`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ verificationToken: 'token-123' });
    req.flush(reply);
  });

  it('should POST to /newsletter/unsubscribe with the unsubscribe token', () => {
    const reply: NewsletterUnsubscribeReply = {
      newsletterUnsubscribeReplyStatus: NewsletterUnsubscribeReplyStatus.UNSUBSCRIBED,
    };

    service.unsubscribeFromNewsletter({ unsubscribeToken: 'token-456' }).subscribe(result => {
      expect(result).toEqual(reply);
    });

    const req = httpMock.expectOne(`${apiUrl}/newsletter/unsubscribe`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ unsubscribeToken: 'token-456' });
    req.flush(reply);
  });
});