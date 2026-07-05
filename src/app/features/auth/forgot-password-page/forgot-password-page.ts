import { Component, ChangeDetectionStrategy, inject, signal, computed, DestroyRef } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, take } from 'rxjs';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Auth } from 'src/app/core/auth/auth';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

const DEFAULT_DISABLED_SECONDS = 60;

@Component({
    selector: 'app-forgot-password-page',
    templateUrl: './forgot-password-page.html',
    styleUrls: ['./forgot-password-page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatCardContent, MatFormField, MatLabel, MatInput, FormsModule, ReactiveFormsModule, MatError, MatButton, RouterLink]
})
export class ForgotPasswordPage {
  private readonly auth = inject(Auth);
  private readonly snackBar = inject(SnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  private readonly secondsRemaining = signal(0);

  readonly clicked = computed(() => this.secondsRemaining() > 0);

  readonly buttonText = computed(() => {
    const remaining = this.secondsRemaining();
    return remaining > 0 ? `Reset Password (${remaining})` : 'Reset Password';
  });

  async forgotPassword(): Promise<void> {
    if (this.isEmailInvalid()) {
      this.email.markAsTouched();
      this.snackBar.error('Please enter a valid E-Mail address');
      return;
    }

    if (await this.auth.forgotPassword(this.email.value)) {
      this.startCountdown();
    }
  }

  isEmailInvalid(): boolean {
    return this.email.hasError('required') || this.email.hasError('email');
  }

  getErrorMessageEMail(): string {
    if (this.email.hasError('required')) {
      return 'You must enter your E-Mail address';
    }

    return this.email.hasError('email') ? 'Not a valid E-Mail address' : '';
  }

  private startCountdown(): void {
    this.secondsRemaining.set(DEFAULT_DISABLED_SECONDS);

    interval(1000)
      .pipe(take(DEFAULT_DISABLED_SECONDS), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.secondsRemaining.update((remaining) => Math.max(remaining - 1, 0));
      });
  }
}