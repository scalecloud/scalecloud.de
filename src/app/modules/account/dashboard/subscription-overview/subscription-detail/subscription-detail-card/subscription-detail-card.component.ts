import { Component, Input } from '@angular/core';
import { SubscriptionDetailReply } from '../subscription-detail';

@Component({
  selector: 'app-subscription-detail-card',
  templateUrl: './subscription-detail-card.component.html',
  styleUrls: ['./subscription-detail-card.component.scss']
})
export class SubscriptionDetailCardComponent {

  @Input() reply: SubscriptionDetailReply | undefined;

  getID(): string {
    return this.reply?.id || '';
  }

  isActive(): boolean {
    return this.reply?.active || false;
  }

  getProductName(): string {
    return this.reply?.product_name || '';
  }

  getProductType(): string {
    return this.reply?.product_type || '';
  }

  getStorageAmount(): number {
    return this.reply?.storage_amount || 0;
  }

  getUserCount(): number {
    return this.reply?.user_count || 0;
  }

  getPricePerMonth(): number {
    return this.reply?.price_per_month || 0;
  }

  getCurrency(): string {
    return this.reply?.currency.toUpperCase() || '';
  }

  isTrailing(): boolean {
    let trailing = false;
    if (this.reply?.status) {
      trailing = this.reply?.status === 'trialing';
    }
    return trailing;
  }

  getTrailingEnd(): number {
    return this.reply?.trial_end || 0;
  }

  isCancelAtPeriodEnd(): boolean {
    return this.reply?.cancel_at_period_end || false;
  }

  getCancelAt(): number {
    return this.reply?.cancel_at || 0;
  }

}
