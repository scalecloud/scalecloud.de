import { Component, ViewChild } from '@angular/core';
import { QuantityComponent } from '../../../subscription-card/quantity/quantity.component';

@Component({
  selector: 'app-checkout-details',
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss']
})
export class CheckoutDetailsComponent {

  @ViewChild(QuantityComponent) quantityComponent: QuantityComponent | undefined;


  startSubscription(): void {

  }

  getQuantity(): number {
    if (this.quantityComponent) {
    return this.quantityComponent?.getQuantity();
    }
    else {
      return 1;
    }
  }

  getPricePerMonth(): number {
    return 10;
  }

  getName(): string {
    return "Ruby";
  }

  getStorageAmount(): number {
    return 12;
  }

  getTrialDays(): number {
    return 14;
  }

  getStorageUnit(): string {
    return "TB";
  }


}
