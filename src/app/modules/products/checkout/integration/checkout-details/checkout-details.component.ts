import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { QuantityComponent } from '../../../subscription-card/quantity/quantity.component';
import { CheckoutProductReply } from '../product/checkout-product-reply';
import { CheckoutProductRequest } from '../product/checkout-product-request';
import { CheckoutProductService } from './checkout-product.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout-details',
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss']
})
export class CheckoutDetailsComponent {
  @ViewChild(QuantityComponent) quantityComponent: QuantityComponent | undefined;
  @Output() startSubscriptionEvent = new EventEmitter<number>();
  checkoutProductReply: CheckoutProductReply | undefined;

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
    private checkoutProductService: CheckoutProductService,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe
  ) { }

  initCheckoutProduct(subscriptionID: string): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        if (!subscriptionID) {
          this.logService.error("subscriptionID is undefined");
        }
        else {
          let checkoutProductRequest: CheckoutProductRequest = {
            subscriptionID: subscriptionID
          }
          const observable = this.checkoutProductService.getCheckoutProduct(checkoutProductRequest).subscribe(
            (checkoutProductReply: CheckoutProductReply) => {
              this.checkoutProductReply = checkoutProductReply;
            });
        }
      }
    });
  }

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

  getPricePerMonth(): string {
    let pricePerMonth = "";
    if (this.checkoutProductReply && this.checkoutProductReply.pricePerMonth > 0) {
      let pricePipe = this.currencyPipe.transform(this.checkoutProductReply.pricePerMonth / 100, this.getCurrency(), 'symbol', '1.0-0');
      if( pricePipe != null ) {
        pricePerMonth = pricePipe;
      }
    }
    return pricePerMonth;
  }

  getCurrency(): string {
    let currency = "";
    if (this.checkoutProductReply) {
      currency = this.checkoutProductReply.currency;
    }
    return currency;
  }

  getName(): string {
    let name = "";
    if (this.checkoutProductReply) {
      name = this.checkoutProductReply.name;
    }
    return name;
  }

  getStorageAmount(): number {
    let storageAmount = 0;
    if (this.checkoutProductReply) {
      storageAmount = this.checkoutProductReply.storageAmount;
    }
    return storageAmount;
  }

  getTrialDays(): number {
    let trialDays = 0;
    if (this.checkoutProductReply) {
      trialDays = this.checkoutProductReply.trialDays;
    }
    return trialDays;
  }

  getStorageUnit(): string {
    let storageUnit = "";
    if (this.checkoutProductReply) {
      storageUnit = this.checkoutProductReply.storageUnit;
    }
    return storageUnit;
  }

}