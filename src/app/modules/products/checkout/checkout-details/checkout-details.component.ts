import { Component, OnInit, ViewChild } from '@angular/core';
import { QuantityComponent } from '../../subscription-card/quantity/quantity.component';

@Component({
  selector: 'app-checkout-details',
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss']
})
export class CheckoutDetailsComponent {

  @ViewChild(QuantityComponent) quantityComponent: QuantityComponent | undefined;

  getQuantity(): number {
    if (this.quantityComponent) {
    return this.quantityComponent?.getQuantity();
    }
    else {
      return 1;
    }
  }

}
