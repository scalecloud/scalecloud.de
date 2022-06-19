import { Component, Input } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutService } from '../checkout/checkout.service';
import { ProductModel } from '../checkout/ProductModel';
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

  constructor(public checkoutService: CheckoutService, private logService: LogService) { }

  openCheckoutSession(): void {
    let productID = ""
    if (this.nextcloudProduct) {
      productID = this.nextcloudProduct.productID;
    } else if (this.synologyProduct) {
      productID = this.synologyProduct.productID;
    }

    const productModel: ProductModel = {
      productID: productID
    }

    this.checkoutService.getCheckoutSession(productModel)
      .subscribe((checkoutModel) => {
        if (checkoutModel == null) {
          this.logService.error('SubscriptionCardComponent.openCheckoutSession: checkoutModel is null');
        } else {
          window.open(checkoutModel.url, '_self');
        }
      }
      );
  }

}
