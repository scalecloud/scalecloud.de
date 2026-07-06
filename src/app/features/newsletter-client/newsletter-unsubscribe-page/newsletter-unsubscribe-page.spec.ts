import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { NewsletterUnsubscribePage } from './newsletter-unsubscribe-page';
import { ServiceStatus } from 'src/app/shared/client-status';
import { NewsletterUnsubscribeReply, NewsletterUnsubscribeReplyStatus } from '../newsletter-model';
import { Log } from 'src/app/core/logging/log';
import { NewsletterClient } from '../newsletter-client';

describe('NewsletterUnsubscribePage', () => {
  let component: NewsletterUnsubscribePage;
  let fixture: ComponentFixture<NewsletterUnsubscribePage>;

  const newsletter = { unsubscribeFromNewsletter: vi.fn() };
  const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  function createComponent(token: string | null): void {
    TestBed.configureTestingModule({
      imports: [NewsletterUnsubscribePage],
      providers: [
        provideRouter([]),
        { provide: NewsletterClient, useValue: newsletter },
        { provide: Log, useValue: log },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap(token === null ? {} : { unsubscribeToken: token }) },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(NewsletterUnsubscribePage);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    newsletter.unsubscribeFromNewsletter.mockReturnValue(
      of({ newsletterUnsubscribeReplyStatus: NewsletterUnsubscribeReplyStatus.UNSUBSCRIBED } as NewsletterUnsubscribeReply),
    );

    createComponent('token-123');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show the error state when the URL has no unsubscribe token', () => {
    createComponent(null);
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(log.error).toHaveBeenCalled();
    expect(newsletter.unsubscribeFromNewsletter).not.toHaveBeenCalled();
  });

  it('should show success state and store the reply once unsubscribing succeeds', () => {
    const reply: NewsletterUnsubscribeReply = {
      newsletterUnsubscribeReplyStatus: NewsletterUnsubscribeReplyStatus.NOTFOUND,
    };
    newsletter.unsubscribeFromNewsletter.mockReturnValue(of(reply));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    expect(component.reply()).toEqual(reply);
  });

  it('should show the error state when the unsubscribe request fails', () => {
    newsletter.unsubscribeFromNewsletter.mockReturnValue(throwError(() => new Error('network error')));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });
});