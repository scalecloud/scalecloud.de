import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-payment-changed-succeeded',
    templateUrl: './payment-changed-succeeded.component.html',
    styleUrls: ['./payment-changed-succeeded.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class PaymentChangedSucceededComponent {

  constructor(
    private readonly returnUrlService: ReturnUrlService,
  ) { }

  openReturnUrl(): void {
    this.returnUrlService.openReturnURL("/dashboard");
  }

}
