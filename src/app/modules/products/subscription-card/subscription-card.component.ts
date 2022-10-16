import { HttpParams } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutIntegrationRequest } from '../checkout/integration/checkout-model-integration';
import { CheckoutProduct } from '../checkout/integration/product/checkout-product';
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

  constructor(
    private checkoutService: CheckoutService,
    private logService: LogService,
    private router: Router
  ) { }

  openCheckoutPortal(): void {
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

  getCheckoutProduct(): CheckoutProduct {
    if (this.nextcloudProduct) {
      return {
        productID: this.nextcloudProduct.productID,
        name: this.nextcloudProduct.name,
        storageAmount: this.nextcloudProduct.storageAmount,
        storageUnit: this.nextcloudProduct.storageUnit,
        trialDays: this.nextcloudProduct.trialDays,
        pricePerMonth: this.nextcloudProduct.pricePerMonth,
        quantity: this.getQuantity(),
      }
    } else if (this.synologyProduct) {
      return {
        productID: this.synologyProduct.productID,
        name: this.synologyProduct.name,
        storageAmount: this.synologyProduct.storageAmount,
        storageUnit: this.synologyProduct.storageUnit,
        trialDays: this.synologyProduct.trialDays,
        pricePerMonth: this.synologyProduct.pricePerMonth,
        quantity: this.getQuantity(),
      }
    } else {
      return {
        productID: "",
        name: "",
        storageAmount: 0,
        storageUnit: "",
        trialDays: 0,
        pricePerMonth: 0,
        quantity: 0,
      }
    }
  }

  openCheckoutIntegration(): void {
    const checkoutProduct: CheckoutProduct = this.getCheckoutProduct();
    this.router.navigate(['/checkout'],
      {
        queryParams: {
          productID: checkoutProduct.productID,
          name: checkoutProduct.name,
          storageAmount: checkoutProduct.storageAmount,
          storageUnit: checkoutProduct.storageUnit,
          trialDays: checkoutProduct.trialDays,
          pricePerMonth: checkoutProduct.pricePerMonth,
          quantity: checkoutProduct.quantity,
        }
      }
    );
  }

  getQuantity(): number {
    let ret = 1;
    if (this.quantityComponent != undefined) {
      ret = this.quantityComponent.getQuantity();
    }
    return ret;
  }

  getName(): string {
    let ret = "";
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.name;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.name;
    }
    return ret;
  }

  getStorageAmount(): number {
    let ret = 0;
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.storageAmount;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.storageAmount;
    }
    return ret;
  }

  getStorageUnit(): string {
    let ret = "";
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.storageUnit;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.storageUnit;
    }
    return ret;
  }

  getTrialDays(): number {
    let ret = 0;
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.trialDays;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.trialDays;
    }
    return ret;
  }

  getPricePerMonth(): number {
    let ret = 0;
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.pricePerMonth;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.pricePerMonth;
    }
    return ret;
  }

}
