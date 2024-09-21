import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { QuantityComponent } from '../../../subscription-card/quantity/quantity.component';
import { CheckoutProductReply } from './checkout-product-reply';
import { CheckoutProductRequest } from './checkout-product-request';
import { CheckoutProductService } from './checkout-product.service';
import { CurrencyPipe } from '@angular/common';
import { CheckoutCreateSubscriptionRequest } from '../checkout-create-subscription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout-details',
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss']
})
export class CheckoutDetailsComponent implements OnInit  {
  @ViewChild(QuantityComponent) quantityComponent: QuantityComponent | undefined;
  @Output() startSubscriptionEvent = new EventEmitter<CheckoutCreateSubscriptionRequest>();
  checkoutProductReply: CheckoutProductReply | undefined;

  constructor(
    private logService: LogService,
    private checkoutProductService: CheckoutProductService,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initCheckoutProduct();
  }

  initCheckoutProduct(): void {
    this.authService.waitForAuth().then(() => {
      const quantity = this.getParamMapQuantity();
      const productID = this.getParamMapProductID();
      if (!productID) {
        this.logService.error("productID is undefined");
      }
      else {
        let checkoutProductRequest: CheckoutProductRequest = {
          productID: productID
        }
        this.checkoutProductService.getCheckoutProduct(checkoutProductRequest).subscribe(
          (checkoutProductReply: CheckoutProductReply) => {
            this.checkoutProductReply = checkoutProductReply;
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
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

  startSubscription(): void {
    const checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest = {
      productID: this.checkoutProductReply.productID,
      quantity: this.getQuantity(),
    }
    this.startSubscriptionEvent.emit(checkoutIntegrationRequest);
  }

  setQuantity(quantity: number): void {
    if (this.quantityComponent) {
      this.quantityComponent.setQuantity(quantity);
    }
  }

  getIsTrialIncluded(): boolean {
    return this.getQuantity() < 2 && this.getTrialDays() > 0;
  }

  getQuantity(): number {
    let quantity = 0;
    if (this.quantityComponent) {
      quantity = this.quantityComponent?.getQuantity();
    }
    return quantity;
  }

  getPricePerMonth(): string {
    let pricePerMonth = "";
    if (this.checkoutProductReply && this.checkoutProductReply.pricePerMonth > 0) {
      let pricePipe = this.currencyPipe.transform(this.checkoutProductReply.pricePerMonth / 100 * this.getQuantity(), this.getCurrency(), 'symbol', '1.0-0');
      if (pricePipe != null) {
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
      storageAmount = this.checkoutProductReply.storageAmount * this.getQuantity();
    }
    return storageAmount;
  }

  getTrialDays(): number {
    let trialDays = 0;
    if (this.checkoutProductReply && this.checkoutProductReply.trialDays > 0) {
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