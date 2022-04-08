import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  clicked = false;
  defaultDisabledSecounds = 30;
  secounds = 0;

  constructor(public authService: AuthService) { }

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



}
