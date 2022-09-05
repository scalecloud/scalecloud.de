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
    private route: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.initParamMap();
    this.paymentElementComponent?.createCheckoutSubscription(this.productID,this.checkoutDetailsComponent?.getQuantity())
  }

  initParamMap(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('productID')) {
      const productID = queryParamMap.get('productID');
      if (productID) {
        this.productID = productID;
      }
    }
    else {
      this.logService.error('ProductID in url is null');
    }
    if (queryParamMap.has('quantity')) {
      const ParamQuantity = queryParamMap.get('quantity');
      if (ParamQuantity) {
        const quantity = Number(ParamQuantity);
        if (quantity > 0) {
          this.setQuantity(quantity);
        }
      }
    }
    else {
      this.logService.error('Quantity in url is null');
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

}
