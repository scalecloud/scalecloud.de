import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { NewsletterConfirmComponent } from './newsletter-confirm.component';
import { NewsletterService } from '../newsletter.service';
import { LogService } from 'src/app/core/logging/log.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { NewsletterConfirmReply } from '../newsletter';

describe('NewsletterConfirmComponent', () => {
  let component: NewsletterConfirmComponent;
  let fixture: ComponentFixture<NewsletterConfirmComponent>;

  const newsletterService = { confirmNewsletterEMail: vi.fn() };
  const logService = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  function createComponent(token: string | null): void {
    TestBed.configureTestingModule({
      imports: [NewsletterConfirmComponent],
      providers: [
        provideRouter([]),
        { provide: NewsletterService, useValue: newsletterService },
        { provide: LogService, useValue: logService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap(token === null ? {} : { verificationToken: token }) },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(NewsletterConfirmComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    newsletterService.confirmNewsletterEMail.mockReturnValue(of({ confirmed: true } as NewsletterConfirmReply));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show the error state when the URL has no verification token', () => {
    createComponent(null);
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logService.error).toHaveBeenCalled();
    expect(newsletterService.confirmNewsletterEMail).not.toHaveBeenCalled();
  });

  it('should show success state and store the reply once confirmation succeeds', () => {
    const reply: NewsletterConfirmReply = { confirmed: true };
    newsletterService.confirmNewsletterEMail.mockReturnValue(of(reply));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    expect(component.reply()).toEqual(reply);
  });

  it('should show the error state when the confirmation request fails', () => {
    newsletterService.confirmNewsletterEMail.mockReturnValue(throwError(() => new Error('network error')));

    createComponent('token-123');
    fixture.detectChanges();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });
});