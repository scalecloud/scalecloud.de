import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { NewsletterConfirmReply, NewsletterConfirmRequest } from '../newsletter';
import { NewsletterService } from '../newsletter.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../loading-failed/loading-failed.component';

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
  private readonly logService = inject(LogService);
  private readonly route = inject(ActivatedRoute);

  reply: NewsletterConfirmReply | undefined;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Loading;

  ngOnInit(): void {
    this.confirmNewsletter();
  }

  confirmNewsletter(): void {
    this.serviceStatus = ServiceStatus.Loading;
    let request: NewsletterConfirmRequest = {
      verificationToken: this.getVerificationToken(),
    };
    if (request.verificationToken === '') {
      this.serviceStatus = ServiceStatus.Error;
      this.logService.error('verificationToken is empty current URL: ' + window.location.href);
      return;
    }
    this.newsletterService.confirmNewsletterEMail(request)
      .subscribe({
        next: reply => {
          this.reply = reply;
          this.serviceStatus = ServiceStatus.Success;
        },
        error: error => {
          this.serviceStatus = ServiceStatus.Error;
        }
      });
  }

  getVerificationToken(): string {
    return this.route.snapshot.paramMap.get('verificationToken') || '';
  }
}
