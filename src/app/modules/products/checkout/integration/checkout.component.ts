import { Component, OnInit, ViewChild } from '@angular/core';
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
export class CheckoutComponent implements OnInit {

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

  ngOnInit(): void {
    const quantity = this.getParamMapQuantity();
    this.setQuantity(quantity);
    const productID = this.getParamMapProductID();
    this.initCheckoutProduct(productID);
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
      const errorMessage = "Could not create Subscription. Please try again.";

      if (!checkoutIntegrationRequest || !checkoutIntegrationRequest.productID || !checkoutIntegrationRequest.quantity) {
        this.snackBarService.error(errorMessage);
        return;
      }

      this.checkoutSubscriptionService.createCheckoutSubscription(checkoutIntegrationRequest).subscribe(
        (checkoutIntegrationReply: CheckoutCreateSubscriptionReply) => {
          if (!checkoutIntegrationReply || !checkoutIntegrationReply.status) {
            this.snackBarService.error(errorMessage);
            return;
          }

          if (checkoutIntegrationReply.status === 'active' || checkoutIntegrationReply.status === 'trialing') {
            this.snackBarService.info("Subscription created.");
            this.router.navigate(['/checkout/status'], { queryParams: checkoutIntegrationReply });
          } else {
            this.snackBarService.error("Could not charge payment method. Please update your payment method.");
          }
        });
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

}
