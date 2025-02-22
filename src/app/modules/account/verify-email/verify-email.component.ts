import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss'],
    standalone: false
})
export class VerifyEmailComponent implements OnInit {
  clicked = false;
  defaultDisabledSecounds = 30;
  secounds = 0;

  isProceedToCheckoutLoading = false;

  constructor(
    public readonly authService: AuthService,
    private readonly returnUrlService: ReturnUrlService,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.disableButtonForSeconds();
  }

  sendVerificationMail() {
    this.authService.sendVerificationMail();
    this.disableButtonForSeconds();
  }

  getButtonText(): string {
    let ret = "";
    if (this.secounds > 0) {
      ret = "Resend Verification E-Mail (" + this.secounds + ")";
    }
    else {
      ret = "Resend Verification E-Mail";
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

  async proceedToCheckout() {
    this.isProceedToCheckoutLoading = true;
    await this.authService.reloadUser();
    if (await this.authService.isLoggedIn(true)) {
      this.returnUrlService.openReturnURL('/');
    } else {
      this.snackBarService.error("Please verify your E-Mail address first.");
    }
    this.isProceedToCheckoutLoading = false;
  }

}
