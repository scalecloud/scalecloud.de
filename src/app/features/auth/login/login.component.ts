import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/core/logging/log.service';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardContent, MatButton, MatCardTitle, MatFormField, MatLabel, MatInput, FormsModule, ReactiveFormsModule, MatError, RouterLink]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly returnUrlService = inject(ReturnUrlService);
  private readonly logService = inject(LogService);

  readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  readonly password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  // FormControl status isn't signal-based, so bridge statusChanges (which
  // also fires on every value change that affects validity) into a signal.
  private readonly emailStatus = toSignal(this.email.statusChanges.pipe(startWith(this.email.status)), {
    initialValue: this.email.status,
  });
  private readonly passwordStatus = toSignal(this.password.statusChanges.pipe(startWith(this.password.status)), {
    initialValue: this.password.status,
  });

  // Track submission attempts so error messages can appear even if a field
  // was never individually touched/blurred (e.g. left empty and submitted).
  private readonly submitted = signal(false);

  readonly emailInvalid = computed(() => {
    this.emailStatus();
    return this.submitted() && (this.email.hasError('required') || this.email.hasError('email'));
  });
  readonly passwordInvalid = computed(() => {
    this.passwordStatus();
    return this.submitted() && this.password.hasError('required');
  });

  readonly emailErrorMessage = computed(() => {
    if (!this.emailInvalid()) {
      return '';
    }
    if (this.email.hasError('required')) {
      return 'You must enter your E-Mail address';
    }
    return this.email.hasError('email') ? 'Not a valid E-Mail address' : '';
  });

  readonly passwordErrorMessage = computed(() => {
    return this.passwordInvalid() ? 'You must enter your password' : '';
  });

  login(): void {
    this.submitted.set(true);

    if (this.emailInvalid() || this.passwordInvalid()) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      this.logService.warn('Invalid inputs in Login.');
      return;
    }

    this.auth.login(this.email.value, this.password.value);
  }

  openUrlKeepReturnUrl(): void {
    this.returnUrlService.openUrlKeepReturnUrl('/register');
  }
}