import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { PaymentElementComponent } from './payment-element/payment-element.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  @ViewChild(CheckoutDetailsComponent) checkoutDetailsComponent: CheckoutDetailsComponent | undefined;
  @ViewChild(PaymentElementComponent) paymentElementComponent: PaymentElementComponent | undefined;
  productID: string | undefined;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit(): void {
    const quantity = this.getParamMapQuantity();
    this.setQuantity(quantity);
    const productID = this.getParamMapProductID();
    if (this.paymentElementComponent && this.checkoutDetailsComponent != undefined && quantity) {
      this.paymentElementComponent.createCheckoutSubscription(productID, this.checkoutDetailsComponent.getQuantity());
    }
    else {
      this.logService.error("Can not get productID or Quantity.")
    }
  }

  getParamMapQuantity(): number {
    let quantity = 1;
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('quantity')) {
      quantity = Number(queryParamMap.get('quantity'));
    } else {
      this.logService.error("Could not get quantity from queryParamMap.");
    }
    return quantity;
  }

  getParamMapProductID(): string | undefined {
    let productID: string | null | undefined = "";
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('productID')) {
      productID = queryParamMap.get('productID');
    } else {
      this.logService.error("Could not get productID from queryParamMap.");
    }
    if (productID == null) {
      this.logService.error("productID is null.");
      productID = undefined;
    }
    return productID;
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

  initCheckoutProduct(subscriptionID: string): void {
    if (!subscriptionID) {
      this.logService.error("subscriptionID is undefined.");
    }
    else {
      if (this.checkoutDetailsComponent) {
        this.checkoutDetailsComponent.initCheckoutProduct(subscriptionID);
      }
      else {
        this.logService.error("CheckoutDetailsComponent is undefined.")
      }
    }
  }

}
