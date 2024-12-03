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
