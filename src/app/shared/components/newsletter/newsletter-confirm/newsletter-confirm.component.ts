import { Component, OnInit } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { NewsletterConfirmReply, NewsletterConfirmRequest } from '../newsletter';
import { NewsletterService } from '../newsletter.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-newsletter-confirm',
  templateUrl: './newsletter-confirm.component.html',
  styleUrl: './newsletter-confirm.component.scss',
  standalone: false,
})
export class NewsletterConfirmComponent implements OnInit {
  reply: NewsletterConfirmReply | undefined;
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
