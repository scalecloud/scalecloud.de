import { Component, Input, ViewChild } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutIntegrationRequest } from '../checkout/integration/checkout-model-integration';
import { CheckoutService } from '../checkout/portal/checkout.service';
import { NextcloudProduct } from '../nextcloud/nextcloud-product';
import { SynologyProduct } from '../synology/synology-product';
import { QuantityComponent } from './quantity/quantity.component';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss']
})
export class SubscriptionCardComponent {

  @Input() nextcloudProduct: NextcloudProduct | undefined;
  @Input() synologyProduct: SynologyProduct | undefined;

  @ViewChild(QuantityComponent) quantityComponent: QuantityComponent | undefined;

  constructor(public checkoutService: CheckoutService, private logService: LogService) { }

  openCheckoutSession(): void {
    let productID = ""
    if (this.nextcloudProduct) {
      productID = this.nextcloudProduct.productID;
    } else if (this.synologyProduct) {
      productID = this.synologyProduct.productID;
    }

    const checkoutIntegrationRequest: CheckoutIntegrationRequest = {
      productID: productID,
      quantity: this.getQuantity(),
    }

    this.checkoutService.getCheckoutSession(checkoutIntegrationRequest)
      .subscribe((checkoutModel) => {
        if (checkoutModel == null) {
          this.logService.error('SubscriptionCardComponent.openCheckoutSession: checkoutModel is null');
        } else {
          window.open(checkoutModel.url, '_self');
        }
      }
      );
  }

  getQuantity(): number {
    let ret = 1;
    if ( this.quantityComponent != undefined ) {
      ret = this.quantityComponent.getQuantity();
    }
    return ret;
  }

}
