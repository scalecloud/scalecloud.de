import { Component, OnInit } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { NewsletterService } from '../newsletter.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ActivatedRoute } from '@angular/router';
import { NewsletterUnsubscribeReply, NewsletterUnsubscribeRequest } from '../newsletter';

@Component({
  selector: 'app-newsletter-unsubscribe',
  templateUrl: './newsletter-unsubscribe.component.html',
  styleUrl: './newsletter-unsubscribe.component.scss',
  standalone: false,
})
export class NewsletterUnsubscribeComponent implements OnInit {

  reply: NewsletterUnsubscribeReply | undefined;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Loading;

  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly logService: LogService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.confirmNewsletter();
  }

  confirmNewsletter(): void {
    this.serviceStatus = ServiceStatus.Loading;
    let request: NewsletterUnsubscribeRequest = {
      newsletterUUID: this.getNewsletterUUID(),
    };
    if (request.newsletterUUID === '') {
      this.serviceStatus = ServiceStatus.Error;
      this.logService.error('newsletterUUID is empty current URL: ' + window.location.href);
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

  getNewsletterUUID(): string {
    return this.route.snapshot.paramMap.get('newsletterUUID') || '';
  }

}
