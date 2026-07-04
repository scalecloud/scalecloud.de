import { Component, inject } from '@angular/core';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';

@Component({
    selector: 'app-payment-changed-requires-payment-method',
    templateUrl: './payment-changed-requires-payment-method.component.html',
    styleUrls: ['./payment-changed-requires-payment-method.component.scss'],
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class PaymentChangedRequiresPaymentMethodComponent {
  private readonly returnUrlService = inject(ReturnUrlService);

  openChangePayment(): void {
    this.returnUrlService.openUrlKeepReturnUrl('/change-payment');
  }
}