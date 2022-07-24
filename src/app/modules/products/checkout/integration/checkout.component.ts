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

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initProductID();
  }

  initProductID(): void {
    const productID = this.route.snapshot.paramMap.get('id');
    if (productID == null) {
      this.logService.error('ProductID in url is null');
    } else {
      this.productID = productID;
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
