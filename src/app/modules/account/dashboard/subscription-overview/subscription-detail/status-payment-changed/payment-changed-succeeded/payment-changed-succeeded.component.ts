import { Component } from '@angular/core';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

@Component({
    selector: 'app-payment-changed-succeeded',
    templateUrl: './payment-changed-succeeded.component.html',
    styleUrls: ['./payment-changed-succeeded.component.scss'],
    standalone: false
})
export class PaymentChangedSucceededComponent {

  constructor(
    private readonly returnUrlService: ReturnUrlService,
  ) { }

  openReturnUrl(): void {
    this.returnUrlService.openReturnURL("/dashboard");
  }

}
