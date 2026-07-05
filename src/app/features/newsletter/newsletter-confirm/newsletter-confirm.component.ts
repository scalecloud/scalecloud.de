import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServiceStatus } from 'src/app/shared/service-status';
import { NewsletterConfirmReply, NewsletterConfirmRequest } from '../newsletter';
import { NewsletterService } from '../newsletter.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../../shared/loading-failed/loading-failed.component';
import { Log } from 'src/app/core/logging/log';

@Component({
    selector: 'app-newsletter-confirm',
    templateUrl: './newsletter-confirm.component.html',
    styleUrl: './newsletter-confirm.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCard,
        MatProgressBar,
        MatCardTitle,
        MatDivider,
        MatCardContent,
        MatProgressSpinner,
        MatIcon,
        MatCardActions,
        MatButton,
        RouterLink,
        LoadingFailedComponent,
    ],
})
export class NewsletterConfirmComponent implements OnInit {
  private readonly newsletterService = inject(NewsletterService);
  private readonly log = inject(Log);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly ServiceStatus = ServiceStatus;
  readonly reply = signal<NewsletterConfirmReply | undefined>(undefined);
  readonly serviceStatus = signal(ServiceStatus.Loading);

  ngOnInit(): void {
    this.confirmNewsletter();
  }

  confirmNewsletter(): void {
    this.serviceStatus.set(ServiceStatus.Loading);
    const request: NewsletterConfirmRequest = {
      verificationToken: this.getVerificationToken(),
    };
    if (request.verificationToken === '') {
      this.serviceStatus.set(ServiceStatus.Error);
      this.log.error('verificationToken is empty current URL: ' + window.location.href);
      return;
    }
    this.newsletterService.confirmNewsletterEMail(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: reply => {
          this.reply.set(reply);
          this.serviceStatus.set(ServiceStatus.Success);
        },
        error: () => {
          this.serviceStatus.set(ServiceStatus.Error);
        }
      });
  }

  getVerificationToken(): string {
    return this.route.snapshot.paramMap.get('verificationToken') || '';
  }
}