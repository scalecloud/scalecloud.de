import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy, inject, viewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { QuantityComponent } from '../../subscription-card/quantity/quantity.component';
import { CheckoutProductReply, CheckoutProductRequest } from './checkout-product';
import { CheckoutProductService } from './checkout-product.service';
import { CurrencyPipe } from '@angular/common';
import { CheckoutCreateSubscriptionRequest } from '../checkout-create-subscription';
import { ActivatedRoute } from '@angular/router';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../../../shared/components/loading-failed/loading-failed.component';

@Component({
    selector: 'app-checkout-details',
    templateUrl: './checkout-details.component.html',
    styleUrls: ['./checkout-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatLabel, QuantityComponent, MatCardSubtitle, MatCardActions, MatButton, LoadingFailedComponent]
})
export class CheckoutDetailsComponent implements OnInit {
  private readonly logService = inject(LogService);
  private readonly checkoutProductService = inject(CheckoutProductService);
  private readonly authService = inject(AuthService);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly route = inject(ActivatedRoute);

  readonly quantityComponent = viewChild(QuantityComponent);
  @Output() startSubscriptionEvent = new EventEmitter<CheckoutCreateSubscriptionRequest>();
  reply: CheckoutProductReply | undefined;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  ngOnInit(): void {
    this.initCheckoutProduct();
  }

  initCheckoutProduct(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      const productID = this.getParamMapProductID();
      if (!productID) {
        this.logService.error("productID is undefined");
      } else {
        const checkoutProductRequest: CheckoutProductRequest = {
          productID: productID
        };
        this.checkoutProductService.getCheckoutProduct(checkoutProductRequest)
          .subscribe({
            next: checkoutProductReply => {
              this.reply = checkoutProductReply;
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.serviceStatus = ServiceStatus.Error;
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
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
      productID: this.reply.productID,
      quantity: this.getQuantity(),
    }
    this.startSubscriptionEvent.emit(checkoutIntegrationRequest);
  }

  getIsTrialIncluded(): boolean {
    return this.getQuantity() < 2 && this.getTrialDays() > 0;
  }

  getQuantity(): number {
    let quantity = 0;
    const quantityComponent = this.quantityComponent();
    if (quantityComponent) {
      quantity = quantityComponent?.getQuantity();
    }
    return quantity;
  }

  getPricePerMonth(): string {
    let pricePerMonth = "";
    if (this.reply && this.reply.pricePerMonth > 0) {
      const pricePipe = this.currencyPipe.transform(this.reply.pricePerMonth / 100 * this.getQuantity(), this.getCurrency(), 'symbol', '1.0-0');
      if (pricePipe != null) {
        pricePerMonth = pricePipe;
      }
    }
    return pricePerMonth;
  }

  getCurrency(): string {
    let currency = "";
    if (this.reply) {
      currency = this.reply.currency;
    }
    return currency;
  }

  getName(): string {
    let name = "";
    if (this.reply) {
      name = this.reply.name;
    }
    return name;
  }

  getStorageAmount(): number {
    let storageAmount = 0;
    if (this.reply) {
      storageAmount = this.reply.storageAmount * this.getQuantity();
    }
    return storageAmount;
  }

  getTrialDays(): number {
    let trialDays = 0;
    if (this.reply && this.reply.trialDays > 0) {
      trialDays = this.reply.trialDays;
    }
    return trialDays;
  }

  getStorageUnit(): string {
    let storageUnit = "";
    if (this.reply) {
      storageUnit = this.reply.storageUnit;
    }
    return storageUnit;
  }

  hasPaymentMethod(): boolean {
    return this.reply?.has_valid_payment_method;
  }

}