import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  password = new UntypedFormControl('', [Validators.required]);

  constructor(
    public auth: AuthService,
    private returnUrlService: ReturnUrlService,
    private logService: LogService,
  ) { }

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
