import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
    return this.subscriptionDetail?.productName || '';
  }

  getProductType(): string {
    return this.subscriptionDetail?.productType || '';
  }

  getStorageAmount(): number {
    return this.subscriptionDetail?.storageAmount || 0;
  }

  getUserCount(): number {
    return this.subscriptionDetail?.userCount || 0;
  }

  getPricePerMonth(): number {
    return this.subscriptionDetail?.pricePerMonth || 0;
  }

  getCurrency(): string {
    return this.subscriptionDetail?.currency.toUpperCase() || '';
  }

  isCancelAtPeriodEnd(): boolean {
    return this.subscriptionDetail?.cancelAtPeriodEnd || false;
  }

  getCancelAt(): number {
    return this.subscriptionDetail?.cancelAt || 0;
  }

}
