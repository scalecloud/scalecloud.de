import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { NewsletterSubscribeComponent } from './newsletter-subscribe.component';
import { NewsletterService } from '../newsletter.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { NewsletterSubscribeReplyStatus } from '../newsletter';

describe('NewsletterSubscribeComponent', () => {
  let component: NewsletterSubscribeComponent;
  let fixture: ComponentFixture<NewsletterSubscribeComponent>;

  const newsletterService = { subscribeToNewsletter: vi.fn() };
  const snackBarService = { info: vi.fn(), infoDuration: vi.fn(), warn: vi.fn(), warnDuration: vi.fn(), error: vi.fn(), errorDuration: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [NewsletterSubscribeComponent],
      providers: [
        provideRouter([]),
        { provide: NewsletterService, useValue: newsletterService },
        { provide: SnackBarService, useValue: snackBarService },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewsletterSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a required error once a value is entered and then cleared', () => {
    component.email.setValue('a');
    component.email.setValue('');

    expect(component.errorMessage()).toBe('You must enter a value');
  });

  it('should show an invalid-email error for a malformed address', () => {
    component.email.setValue('not-an-email');

    expect(component.errorMessage()).toBe('Not a valid E-Mail address.');
  });

  it('should clear the error message once a valid E-Mail is entered', () => {
    component.email.setValue('not-an-email');
    component.email.setValue('user@example.com');

    expect(component.errorMessage()).toBe('');
  });

  it('should not call the service when the form is invalid', () => {
    component.email.setValue('not-an-email');

    component.subscribeToNewsletter();

    expect(newsletterService.subscribeToNewsletter).not.toHaveBeenCalled();
  });

  it('should subscribe, notify, and disable the field on success', () => {
    newsletterService.subscribeToNewsletter.mockReturnValue(
      of({ newsletterSubscribeReplyStatus: NewsletterSubscribeReplyStatus.SUCCESS, email: 'user@example.com' }),
    );
    component.email.setValue('user@example.com');

    component.subscribeToNewsletter();

    expect(newsletterService.subscribeToNewsletter).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(snackBarService.info).toHaveBeenCalledWith('Please check your E-Mail to confirm your newsletter subscription.');
    expect(component.email.disabled).toBe(true);
  });

  it('should show a rate-limit warning without disabling the field', () => {
    newsletterService.subscribeToNewsletter.mockReturnValue(
      of({ newsletterSubscribeReplyStatus: NewsletterSubscribeReplyStatus.RATE_LIMIT, email: 'user@example.com' }),
    );
    component.email.setValue('user@example.com');

    component.subscribeToNewsletter();

    expect(snackBarService.warn).toHaveBeenCalledWith('You have made too many requests. Please wait and try again later.');
    expect(component.email.disabled).toBe(false);
  });

  it('should show an error snackbar when the request fails', () => {
    newsletterService.subscribeToNewsletter.mockReturnValue(throwError(() => new Error('network error')));
    component.email.setValue('user@example.com');

    component.subscribeToNewsletter();

    expect(snackBarService.error).toHaveBeenCalledWith('An error occurred while subscribing to the newsletter.');
  });

  it('resetEMail should clear, re-enable, and clear the error message', () => {
    component.email.setValue('not-an-email');
    component.email.disable();

    component.resetEMail();

    expect(component.email.value).toBeNull();
    expect(component.email.enabled).toBe(true);
    expect(component.errorMessage()).toBe('');
  });
});