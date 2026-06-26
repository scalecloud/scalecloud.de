import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-payment-changed-processing',
    templateUrl: './payment-changed-processing.component.html',
    styleUrls: ['./payment-changed-processing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatCardActions, MatButton]
})
export class PaymentChangedProcessingComponent {
  private readonly returnUrlService = inject(ReturnUrlService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  openReturnUrl(): void {
    this.returnUrlService.openReturnURL("/dashboard");
  }

}
