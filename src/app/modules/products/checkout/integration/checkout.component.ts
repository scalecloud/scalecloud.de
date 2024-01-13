import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from './checkout-create-subscription';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CheckoutSubscriptionService } from './payment-element/checkout-subscription.service';
import { PaymentOverviewComponent } from 'src/app/modules/account/dashboard/payment-overview/payment-overview.component';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  @ViewChild(PaymentOverviewComponent) paymentOverviewComponent: PaymentOverviewComponent | undefined;
  @ViewChild(CheckoutDetailsComponent) checkoutDetailsComponent: CheckoutDetailsComponent | undefined;
  productID: string | undefined;

  constructor(
    private logService: LogService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private checkoutSubscriptionService: CheckoutSubscriptionService,
    private returnUrlService: ReturnUrlService,
  ) { }

  ngAfterViewInit(): void {
    this.paymentOverviewComponent?.initPaymentMethodOverview().then((hasPaymentMethod) => {
      if (hasPaymentMethod) {
        const quantity = this.getParamMapQuantity();
        this.setQuantity(quantity);
        const productID = this.getParamMapProductID();
        this.initCheckoutProduct(productID);
      } else {
        this.returnUrlService.openUrlAddReturnUrl('/dashboard/change-payment');
      }
    }).catch((error) => {
      this.logService.error("Error: " + error);
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

  initCheckoutProduct(productID: string): void {
    if (!productID) {
      this.logService.error("productID is undefined.");
    }
    else {
      if (this.checkoutDetailsComponent) {
        this.checkoutDetailsComponent.initCheckoutProduct(productID);
      }
      else {
        this.logService.error("CheckoutDetailsComponent is undefined.")
      }
    }
  }

  createCheckoutSubscription(checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest): void {
    this.authService.waitForAuth().then(() => {
      if (checkoutIntegrationRequest && checkoutIntegrationRequest.productID && checkoutIntegrationRequest.quantity) {
        this.checkoutSubscriptionService.createCheckoutSubscription(checkoutIntegrationRequest).subscribe(
          (checkoutIntegrationReply: CheckoutCreateSubscriptionReply) => {
            if (checkoutIntegrationReply && checkoutIntegrationReply.subscriptionID) {
              this.snackBarService.info("Subscription created.");
              this.router.navigate(['/checkout/status'], { queryParams: checkoutIntegrationReply });
            }
            else {
              this.snackBarService.error("Could not create Subscription. Please try again.");
            }
          });
      }
      else {
        this.snackBarService.error("Could not create Subscription. Please try again.");
      }
    }
    ).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

}
