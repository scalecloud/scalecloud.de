import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  clicked = false;
  defaultDisabledSecounds = 60;
  secounds = 0;

  constructor(
    public authService: AuthService,
    public snackBarService: SnackBarService
  ) { }

  async forgotPassword(): Promise<void> {
    if (this.isEmailInvalid()) {
      this.snackBarService.error("Please enter a valid E-Mail address");
    }
    else {
      console.log("Valid inputs in Login.");
      if (await this.authService.forgotPassword(this.email.value)) {
        this.disableButtonForSeconds();
      }
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

    let interval = setInterval(() => {
      this.secounds--;
      if (this.secounds < 1) {
        this.clicked = false;
        clearInterval(interval);
      }
    }, 1000);
  }

}
