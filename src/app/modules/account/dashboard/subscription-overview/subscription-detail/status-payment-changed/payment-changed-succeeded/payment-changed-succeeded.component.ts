import { Component } from '@angular/core';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

@Component({
  selector: 'app-payment-changed-succeeded',
  templateUrl: './payment-changed-succeeded.component.html',
  styleUrls: ['./payment-changed-succeeded.component.scss']
})
export class PaymentChangedSucceededComponent {

  constructor(
    private returnUrlService: ReturnUrlService,
  ) { }

  openReturnUrl(): void {
    this.returnUrlService.openReturnURL("/dashboard");
  }

  getReturnUrlName(): string {
    return this.returnUrlService.getReturnUrlButtonName("Return");
  }

}
