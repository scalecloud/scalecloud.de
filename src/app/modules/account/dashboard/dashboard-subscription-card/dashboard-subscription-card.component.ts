import { Component, Input } from '@angular/core';
import { ISubscriptionOverview } from '../subscription-overview';

@Component({
  selector: 'app-dashboard-subscription-card',
  templateUrl: './dashboard-subscription-card.component.html',
  styleUrls: ['./dashboard-subscription-card.component.scss']
})
export class DashboardSubscriptionCardComponent {

  @Input() subscriptionOverview: ISubscriptionOverview | undefined;

  getStorageAmount(): number {
    return this.subscriptionOverview?.storageAmount || 0;
  }

  getContractNumber(): number {
    return this.subscriptionOverview?.contractNumber || 0;
  }

  getProductName(): string {
    return this.subscriptionOverview?.productName || 'Nextcloud';
  }

  getUserCount(): number {
    return this.subscriptionOverview?.userCount || 0;
  }

  getTitle(): string {
    return this.subscriptionOverview?.title || '';
  }

  getID(): string {
    return this.subscriptionOverview?.id || '';
  }

  getSubscriptionArticleID(): string {
    return this.subscriptionOverview?.subscriptionArticelID || '';
  }

  getPricePerMonth(): number {
    return this.subscriptionOverview?.pricePerMonth || 0;
  }

  getStarted(): string {
    return this.subscriptionOverview?.started || '';
  }

  getEndsOn(): string {
    return this.subscriptionOverview?.endsOn || '';
  }


}
