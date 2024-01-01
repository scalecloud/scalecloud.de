import { Component, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PasswordMatchComponent } from './password-match/password-match.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  @ViewChild(PasswordStrengthComponent) passwordStrength: PasswordStrengthComponent | undefined;
  @ViewChild(PasswordMatchComponent) passwordMatch: PasswordMatchComponent | undefined;

  form: UntypedFormGroup;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder, 
    public authService: AuthService,
    private returnUrlService: ReturnUrlService,
    ) {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [this.match('password', 'confirmPassword')]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    let ret = {};
    if (this.form != null) {
      ret = this.form.controls;
    }
    return ret;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form == null || this.form.invalid
      || this.passwordStrength == undefined || !this.passwordStrength.isPasswordStrength()
      || this.passwordMatch == undefined || !this.passwordMatch.isMatching()
    ) {
      return;
    }
    this.authService.register(this.form.value.email, this.form.value.password);
  }

  onReset(): void {
    this.submitted = false;
    if (this.form != null) {
      this.form.reset();
    }
  }

  match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl == null || checkControl.errors && !checkControl.errors.matching) {
        return null;
      }

      if (control != null && control.value !== checkControl.value) {

        checkControl.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  getErrorMessageEMailRequired() {
    return 'You must enter a value';
  }

  getErrorMessageEMailNotValid() {
    return 'Not a valid email';
  }

  getErrorMessagePasswordRequired() {
    return 'You must enter a value';
  }

  getErrorMessagePasswordMinLength() {
    return 'Password must be at least 8 characters long';
  }

  getErrorMessagePasswordConfirmRequired() {
    return 'Confirm Password is required';
  }

  getErrorMessagePasswordConfirmMatch() {
    return 'Confirm Password does not match';
  }

  openUrlKeepReturnUrl() {
    this.returnUrlService.openUrlKeepReturnUrl('/login');
  }

}
