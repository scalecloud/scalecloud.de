import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { NewsletterConfirmPage } from './newsletter-confirm-page';
import { ServiceStatus } from 'src/app/shared/service-status';
import { NewsletterConfirmReply } from '../newsletter-model';
import { Log } from 'src/app/core/logging/log';
import { Newsletter } from '../newsletter';

describe('NewsletterConfirmPage', () => {
  let component: NewsletterConfirmPage;
  let fixture: ComponentFixture<NewsletterConfirmPage>;

  const newsletter = { confirmNewsletterEMail: vi.fn() };
  const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  function createComponent(token: string | null): void {
    TestBed.configureTestingModule({
      imports: [NewsletterConfirmPage],
      providers: [
        provideRouter([]),
        { provide: Newsletter, useValue: newsletter },
        { provide: Log, useValue: log },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap(token === null ? {} : { verificationToken: token }) },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(NewsletterConfirmPage);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    newsletter.confirmNewsletterEMail.mockReturnValue(of({ confirmed: true } as NewsletterConfirmReply));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show the error state when the URL has no verification token', () => {
    createComponent(null);
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(log.error).toHaveBeenCalled();
    expect(newsletter.confirmNewsletterEMail).not.toHaveBeenCalled();
  });

  it('should show success state and store the reply once confirmation succeeds', () => {
    const reply: NewsletterConfirmReply = { confirmed: true };
    newsletter.confirmNewsletterEMail.mockReturnValue(of(reply));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    expect(component.reply()).toEqual(reply);
  });

  it('should show the error state when the confirmation request fails', () => {
    newsletter.confirmNewsletterEMail.mockReturnValue(throwError(() => new Error('network error')));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });
});