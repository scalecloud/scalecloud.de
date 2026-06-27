import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatCardContent, MatFormField, MatLabel, MatInput, FormsModule, ReactiveFormsModule, MatError, MatButton, RouterLink]
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);
  snackBarService = inject(SnackBarService);

  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  clicked = false;
  defaultDisabledSecounds = 60;
  secounds = 0;
  
  async forgotPassword(): Promise<void> {
    if (this.isEmailInvalid()) {
      this.snackBarService.error("Please enter a valid E-Mail address");
    }
    else if (await this.authService.forgotPassword(this.email.value)) {
      this.disableButtonForSeconds();
    }
  }

  isEmailInvalid(): boolean {
    return this.email.hasError('required') || this.email.hasError('email');
  }

  getErrorMessageEMail() {
    if (this.email.hasError('required')) {
      return 'You must enter a your E-Mail address';
    }

    return this.email.hasError('email') ? 'Not a valid E-Mail address' : '';
  }

  getButtonText(): string {
    let ret = "";
    if (this.secounds > 0) {
      ret = "Reset Password (" + this.secounds + ")";
    }
    else {
      ret = "Reset Password";
    }
    return ret;
  }

  disableButtonForSeconds() {
    this.clicked = true;
    this.secounds = this.defaultDisabledSecounds;

    const interval = setInterval(() => {
      this.secounds--;
      if (this.secounds < 1) {
        this.clicked = false;
        clearInterval(interval);
      }
    }, 1000);
  }

}
