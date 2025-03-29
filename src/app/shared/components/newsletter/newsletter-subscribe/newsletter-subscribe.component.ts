import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { NewsletterService } from '../newsletter.service';
import { NewsletterSubscribeReplyStatus, NewsletterSubscribeRequest } from '../newsletter';

@Component({
  selector: 'app-newsletter-subscribe',
  templateUrl: './newsletter-subscribe.component.html',
  styleUrl: './newsletter-subscribe.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSubscribeComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');

  constructor(
    private readonly snackBarService: SnackBarService,
    private readonly newsletterService: NewsletterService,
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid E-Mail address.');
    } else {
      this.errorMessage.set('');
    }
  }

  subscribeToNewsletter() {
    if (this.email.valid) {
      let request: NewsletterSubscribeRequest = {
        email: this.email.value,
      };
      this.newsletterService.subscribeToNewsletter(request)
        .subscribe({
          next: reply => {
            if (reply.newsletterSubscribeReplyStatus === NewsletterSubscribeReplyStatus.SUCCESS) {
              this.snackBarService.info('Please check your E-Mail to confirm your newsletter subscription.');
              this.email.disable();
            } else if (reply.newsletterSubscribeReplyStatus === NewsletterSubscribeReplyStatus.INVALID_EMAIL) {
              this.snackBarService.error('The E-Mail address is invalid.');
              this.errorMessage.set('Not a valid E-Mail address.');
            } else if (reply.newsletterSubscribeReplyStatus === NewsletterSubscribeReplyStatus.RATE_LIMIT) {
              this.snackBarService.warn('You have made too many requests. Please wait and try again later.');
            }
          },
          error: () => {
            this.snackBarService.error('An error occurred while subscribing to the newsletter.');
          },
        });
    }
  }

  resetEMail() {
    this.email.reset();
    this.email.enable();
    this.errorMessage.set('');
  }
}
