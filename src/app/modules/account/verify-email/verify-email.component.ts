import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

const RESEND_COOLDOWN_SECONDS = 30;

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatCardTitle, MatCardContent, MatButton, MatIcon, MatProgressSpinner],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  readonly authService = inject(AuthService);
  private readonly returnUrlService = inject(ReturnUrlService);
  private readonly snackBarService = inject(SnackBarService);

  private readonly secondsRemaining = signal(0);
  readonly isResendDisabled = computed(() => this.secondsRemaining() > 0);
  readonly resendButtonText = computed(() => {
    const seconds = this.secondsRemaining();
    return seconds > 0
      ? `Resend Verification E-Mail (${seconds})`
      : 'Resend Verification E-Mail';
  });

  readonly isProceedToCheckoutLoading = signal(false);

  private intervalId: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.startResendCooldown();
  }

  ngOnDestroy(): void {
    this.clearCooldownInterval();
  }

  sendVerificationMail(): void {
    this.authService.sendVerificationMail();
    this.startResendCooldown();
  }

  async proceedToCheckout(): Promise<void> {
    this.isProceedToCheckoutLoading.set(true);
    try {
      await this.authService.reloadUser();
      if (await this.authService.isLoggedIn(true)) {
        this.returnUrlService.openReturnURL('/');
      } else {
        this.snackBarService.error('Please verify your E-Mail address first.');
      }
    } finally {
      this.isProceedToCheckoutLoading.set(false);
    }
  }

  private startResendCooldown(): void {
    this.clearCooldownInterval();
    this.secondsRemaining.set(RESEND_COOLDOWN_SECONDS);

    this.intervalId = setInterval(() => {
      const next = this.secondsRemaining() - 1;
      this.secondsRemaining.set(Math.max(next, 0));
      if (next < 1) {
        this.clearCooldownInterval();
      }
    }, 1000);
  }

  private clearCooldownInterval(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}