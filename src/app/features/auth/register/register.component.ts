import { Component, ChangeDetectionStrategy, inject, viewChild, signal, computed } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, ValidatorFn, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { PasswordMatchComponent } from './password-match/password-match.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Auth } from 'src/app/core/auth/auth';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

interface RegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  acceptTerms: FormControl<boolean>;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardContent, MatButton, FormsModule, ReactiveFormsModule, MatCardTitle, MatFormField, MatLabel, MatInput, MatError, PasswordStrengthComponent, PasswordMatchComponent]
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly returnUrl = inject(ReturnUrl);

  readonly passwordStrength = viewChild(PasswordStrengthComponent);
  readonly passwordMatch = viewChild(PasswordMatchComponent);

  readonly form: FormGroup<RegisterForm> = this.formBuilder.group(
    {
      email: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required] }),
      acceptTerms: this.formBuilder.control(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    },
    {
      validators: [this.match('password', 'confirmPassword')],
    }
  );

  // Submission state lives in a signal so error visibility is reactive
  // without relying on Zone-based change detection.
  private readonly submitted = signal(false);

  // FormGroup status isn't signal-based, so bridge statusChanges into a
  // signal; this also fires whenever a control's value affects validity.
  private readonly formStatus = toSignal(this.form.statusChanges.pipe(startWith(this.form.status)), {
    initialValue: this.form.status,
  });

  readonly emailErrors = computed(() => {
    this.formStatus();
    return this.submitted() ? this.form.controls.email.errors : null;
  });

  readonly passwordErrors = computed(() => {
    this.formStatus();
    return this.submitted() ? this.form.controls.password.errors : null;
  });

  readonly confirmPasswordErrors = computed(() => {
    this.formStatus();
    return this.submitted() ? this.form.controls.confirmPassword.errors : null;
  });

  readonly acceptTermsErrors = computed(() => {
    this.formStatus();
    return this.submitted() ? this.form.controls.acceptTerms.errors : null;
  });

  onSubmit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    const passwordStrength = this.passwordStrength();
    const passwordMatch = this.passwordMatch();

    if (this.form.invalid
      || passwordStrength == undefined || !passwordStrength.isPasswordStrength()
      || passwordMatch == undefined || !passwordMatch.isMatching()
    ) {
      return;
    }

    this.auth.register(this.form.controls.email.value, this.form.controls.password.value);
  }

  onReset(): void {
    this.submitted.set(false);
    this.form.reset();
  }

  match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl == null || (checkControl.errors && !checkControl.errors['matching'])) {
        return null;
      }

      if (control != null && control.value !== checkControl.value) {
        checkControl.setErrors({ matching: true });
        return { matching: true };
      }

      return null;
    };
  }

  getErrorMessageEMailRequired(): string {
    return 'You must enter a value';
  }

  getErrorMessageEMailNotValid(): string {
    return 'Not a valid email';
  }

  getErrorMessagePasswordRequired(): string {
    return 'You must enter a value';
  }

  getErrorMessagePasswordMinLength(): string {
    return 'Password must be at least 8 characters long';
  }

  getErrorMessagePasswordConfirmRequired(): string {
    return 'Confirm Password is required';
  }

  getErrorMessagePasswordConfirmMatch(): string {
    return 'Confirm Password does not match';
  }

  openUrlKeepReturnUrl(): void {
    this.returnUrl.openUrlKeepReturnUrl('/login');
  }
}