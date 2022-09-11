import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { QuantityComponent } from '../../../subscription-card/quantity/quantity.component';

@Component({
  selector: 'app-checkout-details',
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss']
})
export class CheckoutDetailsComponent {
  @ViewChild(QuantityComponent) quantityComponent: QuantityComponent | undefined;
  @Output() startSubscriptionEvent = new EventEmitter<number>();

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
  ) {}

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
