import { Component } from '@angular/core';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

@Component({
    selector: 'app-payment-changed-requires-payment-method',
    templateUrl: './payment-changed-requires-payment-method.component.html',
    styleUrls: ['./payment-changed-requires-payment-method.component.scss'],
    standalone: false
})
export class PaymentChangedRequiresPaymentMethodComponent {

  constructor(
    private readonly returnUrlService: ReturnUrlService,
  ) { }

  openChangePayment(): void {
    this.returnUrlService.openUrlKeepReturnUrl("/change-payment");
  }

}
