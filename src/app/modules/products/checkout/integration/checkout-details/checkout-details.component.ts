import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { QuantityComponent } from '../../../subscription-card/quantity/quantity.component';
import { CheckoutProduct } from '../product/checkout-product';

@Component({
  selector: 'app-checkout-details',
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss']
})
export class CheckoutDetailsComponent {
  @Input() checkoutProduct: CheckoutProduct | undefined;
  @ViewChild(QuantityComponent) quantityComponent: QuantityComponent | undefined;
  @Output() startSubscriptionEvent = new EventEmitter<number>();

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
  ) { }

  startSubscription(): void {
    this.logService.info("Subscription started. Quantity: " + this.getQuantity());
    this.startSubscriptionEvent.emit(this.getQuantity());
  }

  setQuantity(quantity: number): void {
    if (this.quantityComponent) {
      this.quantityComponent.setQuantity(quantity);
    }
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
    let pricePerMonth = 0;
    if (this.checkoutProduct) {
      pricePerMonth = this.checkoutProduct.pricePerMonth;
    }
    return pricePerMonth;
  }

  getName(): string {
    let name = "";
    if (this.checkoutProduct) {
      name = this.checkoutProduct.name;
    }
    return name;
  }

  getStorageAmount(): number {
    let storageAmount = 0;
    if (this.checkoutProduct) {
      storageAmount = this.checkoutProduct.storageAmount;
    }
    return storageAmount;
  }

  getTrialDays(): number {
    let trialDays = 0;
    if (this.checkoutProduct) {
      trialDays = this.checkoutProduct.trialDays;
    }
    return trialDays;
  }

  getStorageUnit(): string {
    let storageUnit = "";
    if (this.checkoutProduct) {
      storageUnit = this.checkoutProduct.storageUnit;
    }
    return storageUnit;
  }
}