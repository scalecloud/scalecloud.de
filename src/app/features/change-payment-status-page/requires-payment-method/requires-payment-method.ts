import { Component, inject } from '@angular/core';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

@Component({
    selector: 'app-requires-payment-method',
    templateUrl: './requires-payment-method.html',
    styleUrls: ['./requires-payment-method.scss'],
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class RequiresPaymentMethod {
  private readonly returnUrl = inject(ReturnUrl);

  openChangePayment(): void {
    this.returnUrl.openUrlKeepReturnUrl('/change-payment');
  }
}