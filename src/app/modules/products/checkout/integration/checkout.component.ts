import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { PaymentElementComponent } from './payment-element/payment-element.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  @ViewChild(CheckoutDetailsComponent) checkoutDetailsComponent: CheckoutDetailsComponent | undefined;
  @ViewChild(PaymentElementComponent) paymentElementComponent: PaymentElementComponent | undefined;
  productID: string | undefined;
  quantity: number = 1;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initParamMap();
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
        if( quantity > 0 ) {
          this.quantity = quantity;
        }
      }
    }
    else {
      this.logService.error('Quantity in url is null');
    }
  }

  setQuantity(quantity: number): void {
    if (this.paymentElementComponent) {
      this.paymentElementComponent.setQuantity(quantity);
    }
    else {
      this.logService.error('Could not set quantity');
    }
  }

}
