import { Component, Input } from '@angular/core';
import { CheckoutService } from '../checkout/checkout.service';
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

  constructor(public checkoutService: CheckoutService) { }

  checkout(): void {
    let productID = ""
    if (this.nextcloudProduct) {
      productID = this.nextcloudProduct.productID;
    } else if (this.synologyProduct) {
      productID = this.synologyProduct.productID;
    }
    this.checkoutService.checkout(productID);
  }


}
