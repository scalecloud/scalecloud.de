import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ISubscriptionOverview } from './subscription-overview';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-subscription-overview',
    templateUrl: './subscription-overview.component.html',
    styleUrls: ['./subscription-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatCardSubtitle, MatDivider, MatCardContent, MatList, MatListItem, MatTooltip, MatIcon, MatCardActions, MatButton, RouterLink]
})
export class SubscriptionOverviewComponent {

  @Input() subscriptionOverview: ISubscriptionOverview | undefined;
 
  getID(): string {
    return this.subscriptionOverview?.id || '';
  }

  getProductName(): string {
    return this.subscriptionOverview?.productName || '';
  }

  getProductType(): string {
    return this.subscriptionOverview?.productType || '';
  }

  getStorageAmount(): number {
    return this.subscriptionOverview?.storageAmount || 0;
  }

  getTotalStorageAmount(): number {
    return this.getStorageAmount() * this.getUserCount();
  }

  getUserCount(): number {
    return this.subscriptionOverview?.userCount || 0;
  }

}
