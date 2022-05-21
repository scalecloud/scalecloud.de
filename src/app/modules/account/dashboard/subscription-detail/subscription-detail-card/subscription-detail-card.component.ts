import { Component, Input, OnInit } from '@angular/core';
import { ISubscriptionDetail } from '../subscription-detail';

@Component({
  selector: 'app-subscription-detail-card',
  templateUrl: './subscription-detail-card.component.html',
  styleUrls: ['./subscription-detail-card.component.scss']
})
export class SubscriptionDetailCardComponent {

  @Input() subscriptionDetail: ISubscriptionDetail | undefined;

  getStorageAmount(): number {
    return this.subscriptionDetail?.storageAmount || 0;
  }

  getContractNumber(): number {
    return this.subscriptionDetail?.contractNumber || 0;
  }

  getProductName(): string {
    return this.subscriptionDetail?.productName || 'Nextcloud';
  }

  getUserCount(): number {
    return this.subscriptionDetail?.userCount || 0;
  }

  getTitle(): string {
    return this.subscriptionDetail?.title || '';
  }

  getID(): string {
    return this.subscriptionDetail?.id || '';
  }

  getSubscriptionArticleID(): string {
    return this.subscriptionDetail?.subscriptionArticelID || '';
  }

  getPricePerMonth(): number {
    return this.subscriptionDetail?.pricePerMonth || 0;
  }

  getStarted(): string {
    return this.subscriptionDetail?.started || '';
  }

  getEndsOn(): string {
    return this.subscriptionDetail?.endsOn || '';
  }


}
