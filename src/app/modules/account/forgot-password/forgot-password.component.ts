import { Component, OnInit } from '@angular/core';
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

  constructor(
    public authService: AuthService,
    public snackBarService: SnackBarService
  ) { }

  forgotPassword(): void {
    if (this.isEmailInvalid()) {
      this.snackBarService.error("Please enter a valid E-Mail address");
    }
    else {
      console.log("Valid inputs in Login.");
      this.authService.forgotPassword(this.email.value);
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

}
