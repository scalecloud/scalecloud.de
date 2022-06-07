import { Component, Input } from '@angular/core';
import { NextcloudProduct } from '../nextcloud/nextcloud-product';
import { SynologyProduct } from '../synology/synology-product';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss']
})
export class SubscriptionCardComponent {

  @Input() nextcloudProduct: NextcloudProduct | undefined;
  @Input() synologyProduct: SynologyProduct | undefined;

  constructor() { }

  checkout(): void {
    if (this.nextcloudProduct) {
      console.log(this.nextcloudProduct);
    } else if (this.synologyProduct) {
      console.log(this.synologyProduct);
    }
  }


}
