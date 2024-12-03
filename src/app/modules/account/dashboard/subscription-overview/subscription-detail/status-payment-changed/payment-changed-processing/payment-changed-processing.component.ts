import { Component } from '@angular/core';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

@Component({
  selector: 'app-payment-changed-processing',
  templateUrl: './payment-changed-processing.component.html',
  styleUrls: ['./payment-changed-processing.component.scss']
})
export class PaymentChangedProcessingComponent {

  constructor(
    private returnUrlService: ReturnUrlService,
  ) { }

  openReturnUrl(): void {
    this.returnUrlService.openReturnURL("/dashboard");
  }

}
