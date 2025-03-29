import { Component, OnInit } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { NewsletterService } from '../newsletter.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ActivatedRoute } from '@angular/router';
import { NewsletterUnsubscribeReply, NewsletterUnsubscribeReplyStatus, NewsletterUnsubscribeRequest } from '../newsletter';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-newsletter-unsubscribe',
  templateUrl: './newsletter-unsubscribe.component.html',
  styleUrl: './newsletter-unsubscribe.component.scss',
  standalone: false,
})
export class NewsletterUnsubscribeComponent implements OnInit {

  reply: NewsletterUnsubscribeReply | undefined;
  NewsletterUnsubscribeReplyStatus = NewsletterUnsubscribeReplyStatus;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Loading;

  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly logService: LogService,
    private readonly route: ActivatedRoute,
    private readonly snackbarservice: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.unsubscribeNewsletter();
  }

  unsubscribeNewsletter(): void {
    this.serviceStatus = ServiceStatus.Loading;
    let request: NewsletterUnsubscribeRequest = {
      unsubscribeToken: this.getUnsubscribeToken(),
    };
    if (request.unsubscribeToken === '') {
      this.serviceStatus = ServiceStatus.Error;
      this.logService.error('unsubscribeToken is empty current URL: ' + window.location.href);
      return;
    }
    this.newsletterService.unsubscribeFromNewsletter(request)
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

  getUnsubscribeToken(): string {
    return this.route.snapshot.paramMap.get('unsubscribeToken') || '';
  }

}
