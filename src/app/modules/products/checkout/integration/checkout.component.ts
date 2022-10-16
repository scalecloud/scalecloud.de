import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { PaymentElementComponent } from './payment-element/payment-element.component';
import { CheckoutProduct } from './product/checkout-product';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  @ViewChild(CheckoutDetailsComponent) checkoutDetailsComponent: CheckoutDetailsComponent | undefined;
  @ViewChild(PaymentElementComponent) paymentElementComponent: PaymentElementComponent | undefined;
  checkoutProduct: CheckoutProduct | undefined;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.initParamMap();
    if (this.paymentElementComponent && this.checkoutDetailsComponent != undefined && this.checkoutProduct) {
      this.paymentElementComponent.createCheckoutSubscription(this.checkoutProduct.productID, this.checkoutDetailsComponent.getQuantity());
    }
    else {
      this.logService.error("Can not get productID or Quantity.")
    }
  }

  initParamMap(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;

    if (queryParamMap.has('productID')
      && queryParamMap.has('name')
      && queryParamMap.has('storageAmount')
      && queryParamMap.has('storageUnit')
      && queryParamMap.has('trialDays')
      && queryParamMap.has('pricePerMonth')
      && queryParamMap.has('quantity')) {
      this.checkoutProduct = {
        productID: queryParamMap.get('productID')!,
        name: queryParamMap.get('name')!,
        storageAmount: Number(queryParamMap.get('storageAmount')),
        storageUnit: queryParamMap.get('storageUnit')!,
        trialDays: Number(queryParamMap.get('trialDays')),
        pricePerMonth: Number(queryParamMap.get('pricePerMonth')),
        quantity: Number(queryParamMap.get('quantity')),
      }
      this.logService.info("CheckoutProduct: " + JSON.stringify(this.checkoutProduct));
      if (this.checkoutProduct.quantity > 0) {
        this.setQuantity(this.checkoutProduct.quantity);
      }
    } else {
      this.logService.error("Could not get all parameters from queryParamMap.");
    }

  }

  getQuantity(): number {
    let quantity = 1;
    if (this.checkoutDetailsComponent != undefined) {
      quantity = this.checkoutDetailsComponent.getQuantity();
    }
    return quantity;
  }

  setQuantity(quantity: number): void {
    if (this.checkoutDetailsComponent) {
      this.checkoutDetailsComponent.setQuantity(quantity);
    }
    else {
      this.logService.error('Could not set quantity');
    }
  }

  startSubscription(quantity: number): void {
    if (this.paymentElementComponent) {
      this.paymentElementComponent.startSubscription(quantity);
    }
    else {
      this.logService.error("PaymentElementComponent is undefined.")
    }
  }

}
