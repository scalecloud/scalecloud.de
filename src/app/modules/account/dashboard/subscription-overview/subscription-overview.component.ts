import { Component, Input } from '@angular/core';
import { ISubscriptionOverview } from './subscription-overview';

@Component({
  selector: 'app-subscription-overview',
  templateUrl: './subscription-overview.component.html',
  styleUrls: ['./subscription-overview.component.scss']
})
export class SubscriptionOverviewComponent {

  @Input() subscriptionOverview: ISubscriptionOverview | undefined;
 
  getID(): string {
    return this.subscriptionOverview?.id || '';
  }

  getTitle(): string {
    return this.subscriptionOverview?.title || '';
  }

  getProductName(): string {
    return this.subscriptionOverview?.productName || '';
  }

  getStorageAmount(): number {
    return this.subscriptionOverview?.storageAmount || 0;
  }

  getUserCount(): number {
    return this.subscriptionOverview?.userCount || 0;
  }

}
