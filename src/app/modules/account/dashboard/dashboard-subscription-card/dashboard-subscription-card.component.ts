import { Component, Input, OnInit } from '@angular/core';
import { ISubscription } from '../subscription';

@Component({
  selector: 'app-dashboard-subscription-card',
  templateUrl: './dashboard-subscription-card.component.html',
  styleUrls: ['./dashboard-subscription-card.component.scss']
})
export class DashboardSubscriptionCardComponent {

  @Input() subscription: ISubscription | undefined;

  getStorageAmount(): number {
    return this.subscription?.storageAmount || 0;
  }

  getContractNumber(): number {
    return this.subscription?.contractNumber || 0;
  }

  getProductName(): string {
    return this.subscription?.productName || 'Nextcloud';
  }

  getUserCount(): number {
    return this.subscription?.userCount || 0;
  }

  getTitle(): string {
    return this.subscription?.title || '';
  }

  getID(): string {
    return this.subscription?.id || '';
  }

  getSubscriptionArticleID(): string {
    return this.subscription?.subscriptionArticelID || '';
  }

  getPricePerMonth(): number {
    return this.subscription?.pricePerMonth || 0;
  }

  getStarted(): string {
    return this.subscription?.started || '';
  }

  getEndsOn(): string {
    return this.subscription?.endsOn || '';
  }


}
