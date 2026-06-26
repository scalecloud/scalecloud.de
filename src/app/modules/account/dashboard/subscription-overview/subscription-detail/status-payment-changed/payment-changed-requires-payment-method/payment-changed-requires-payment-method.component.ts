import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-payment-changed-requires-payment-method',
    templateUrl: './payment-changed-requires-payment-method.component.html',
    styleUrls: ['./payment-changed-requires-payment-method.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class PaymentChangedRequiresPaymentMethodComponent {

  constructor(
    private readonly returnUrlService: ReturnUrlService,
  ) { }

  openChangePayment(): void {
    this.returnUrlService.openUrlKeepReturnUrl("/change-payment");
  }

}
