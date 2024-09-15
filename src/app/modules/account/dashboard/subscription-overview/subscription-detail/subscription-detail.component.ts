import { Component, ViewChild } from '@angular/core';
import { SubscriptionDetailCardComponent } from './subscription-detail-card/subscription-detail-card.component';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.scss']
})
export class SubscriptionDetailComponent {

  @ViewChild(SubscriptionDetailCardComponent) subscriptionDetailCard: SubscriptionDetailCardComponent;

  reloadSubscriptionDetailEvent() {
    if (this.subscriptionDetailCard) {
      this.subscriptionDetailCard.reloadSubscriptionDetail();
    }
  }

}
