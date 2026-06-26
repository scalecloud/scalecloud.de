import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';


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

  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  password = new UntypedFormControl('', [Validators.required]);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  login(): void {
    if (this.isEmailInvalid() || this.isPasswordInvalid()) {
      this.logService.warn("Invalid inputs in Login.");
    }
    else {
      this.auth.login(this.email.value, this.password.value);
    }
  }

  isEmailInvalid(): boolean {
    return this.email.hasError('required') || this.email.hasError('email');
  }

  isPasswordInvalid(): boolean {
    return this.password.hasError('required');
  }

  getErrorMessageEMail() {
    if (this.email.hasError('required')) {
      return 'You must enter a your E-Mail address';
    }

    return this.email.hasError('email') ? 'Not a valid E-Mail address' : '';
  }

  getErrorMessagePassword() {
    let ret = "";
    if (this.password.hasError('required')) {
      ret = 'You must enter your password';
    }
    return ret;
  }

  openUrlKeepReturnUrl() {
    this.returnUrlService.openUrlKeepReturnUrl('/register');
  }


}
