import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { NewsletterService } from '../newsletter.service';
import { LogService } from 'src/app/core/logging/log.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsletterUnsubscribeReply, NewsletterUnsubscribeReplyStatus, NewsletterUnsubscribeRequest } from '../newsletter';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../../shared/loading-failed/loading-failed.component';

@Component({
    selector: 'app-newsletter-unsubscribe',
    templateUrl: './newsletter-unsubscribe.component.html',
    styleUrl: './newsletter-unsubscribe.component.scss',
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
export class NewsletterUnsubscribeComponent implements OnInit {
  private readonly newsletterService = inject(NewsletterService);
  private readonly logService = inject(LogService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly NewsletterUnsubscribeReplyStatus = NewsletterUnsubscribeReplyStatus;
  readonly ServiceStatus = ServiceStatus;
  readonly reply = signal<NewsletterUnsubscribeReply | undefined>(undefined);
  readonly serviceStatus = signal(ServiceStatus.Loading);

  ngOnInit(): void {
    this.unsubscribeNewsletter();
  }

  unsubscribeNewsletter(): void {
    this.serviceStatus.set(ServiceStatus.Loading);
    const request: NewsletterUnsubscribeRequest = {
      unsubscribeToken: this.getUnsubscribeToken(),
    };
    if (request.unsubscribeToken === '') {
      this.serviceStatus.set(ServiceStatus.Error);
      this.logService.error('unsubscribeToken is empty current URL: ' + window.location.href);
      return;
    }
    this.newsletterService.unsubscribeFromNewsletter(request)
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

  getUnsubscribeToken(): string {
    return this.route.snapshot.paramMap.get('unsubscribeToken') || '';
  }
}