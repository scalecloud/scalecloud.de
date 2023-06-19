import { Component, Input } from '@angular/core';
import { ISubscriptionDetail } from '../subscription-detail';

@Component({
  selector: 'app-subscription-detail-card',
  templateUrl: './subscription-detail-card.component.html',
  styleUrls: ['./subscription-detail-card.component.scss']
})
export class SubscriptionDetailCardComponent {

  @Input() subscriptionDetail: ISubscriptionDetail | undefined;

  getID(): string {
    return this.subscriptionDetail?.id || '';
  }

  isActive(): boolean {
    return this.subscriptionDetail?.active || false;
  }

  getProductName(): string {
    return this.subscriptionDetail?.product_name || '';
  }

  getProductType(): string {
    return this.subscriptionDetail?.product_type || '';
  }

  getStorageAmount(): number {
    return this.subscriptionDetail?.storage_amount || 0;
  }

  getUserCount(): number {
    return this.subscriptionDetail?.user_count || 0;
  }

  getPricePerMonth(): number {
    return this.subscriptionDetail?.price_per_month || 0;
  }

  getCurrency(): string {
    return this.subscriptionDetail?.currency.toUpperCase() || '';
  }

  isTrailing(): boolean {
    let trailing = false;
    if (this.subscriptionDetail?.status) {
      trailing = this.subscriptionDetail?.status === 'trialing';
    }
    return trailing;
  }

  getTrailingEnd(): number {
    return this.subscriptionDetail?.trial_end || 0;
  }

  isCancelAtPeriodEnd(): boolean {
    return this.subscriptionDetail?.cancel_at_period_end || false;
  }

  getCancelAt(): number {
    return this.subscriptionDetail?.cancel_at || 0;
  }

}
