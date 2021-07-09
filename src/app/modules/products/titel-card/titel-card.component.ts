import { Component, OnInit, Input } from '@angular/core';


export enum SubscriptionType {
  Nextcloud,
  Synology
}

@Component({
  selector: 'app-titel-card',
  templateUrl: './titel-card.component.html',
  styleUrls: ['./titel-card.component.scss']
})
export class TitelCardComponent implements OnInit {

  @Input() subscriptionType: SubscriptionType;
  constructor() {
    this.subscriptionType = SubscriptionType.Nextcloud;
  }

  ngOnInit(): void {
  }

  get isSynology() {
    return this.subscriptionType === SubscriptionType.Synology;
  }

  get isNextcloud() {
    return this.subscriptionType === SubscriptionType.Nextcloud;
  }

}
