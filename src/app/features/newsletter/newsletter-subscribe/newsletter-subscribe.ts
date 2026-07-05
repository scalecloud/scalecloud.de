import { ChangeDetectionStrategy, Component, DestroyRef, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { NewsletterSubscribeReplyStatus, NewsletterSubscribeRequest } from '../newsletter-model';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { Newsletter } from '../newsletter';

@Component({
    selector: 'app-newsletter-subscribe',
    templateUrl: './newsletter-subscribe.html',
    styleUrl: './newsletter-subscribe.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatIcon,
        MatCardSubtitle,
        MatCardContent,
        FormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        MatError,
        MatIconButton,
        MatSuffix,
        MatButton,
        RouterLink,
    ],
})
export class NewsletterSubscribe {
  private readonly snackBar = inject(SnackBar);
  private readonly newsletter = inject(Newsletter);
  private readonly destroyRef = inject(DestroyRef);

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');

  constructor() {
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
      const request: NewsletterSubscribeRequest = {
        email: this.email.value ?? '',
      };
      this.newsletter.subscribeToNewsletter(request)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: reply => {
            if (reply.newsletterSubscribeReplyStatus === NewsletterSubscribeReplyStatus.SUCCESS) {
              this.snackBar.info('Please check your E-Mail to confirm your newsletter subscription.');
              this.email.disable();
            } else if (reply.newsletterSubscribeReplyStatus === NewsletterSubscribeReplyStatus.INVALID_EMAIL) {
              this.snackBar.error('The E-Mail address is invalid.');
              this.errorMessage.set('Not a valid E-Mail address.');
            } else if (reply.newsletterSubscribeReplyStatus === NewsletterSubscribeReplyStatus.RATE_LIMIT) {
              this.snackBar.warn('You have made too many requests. Please wait and try again later.');
            }
          },
          error: () => {
            this.snackBar.error('An error occurred while subscribing to the newsletter.');
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