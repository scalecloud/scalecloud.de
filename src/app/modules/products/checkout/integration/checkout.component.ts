import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { CheckoutIntegrationReply } from './checkout-model-integration';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CheckoutSubscriptionService } from './payment-element/checkout-subscription.service';
import { CheckoutModelPortalRequest } from '../portal/checkout-model-portal';
import { StripePaymentElementComponent } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-element.component';
import { StripeIntent, InitStripePayment, SubmitStripePayment } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-setup-intent';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  @ViewChild(CheckoutDetailsComponent) checkoutDetailsComponent: CheckoutDetailsComponent | undefined;
  @ViewChild(StripePaymentElementComponent) stripePaymentElementComponent: StripePaymentElementComponent | undefined;
  productID: string | undefined;

  checkoutIntegrationReply: CheckoutIntegrationReply | undefined;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private checkoutSubscriptionService: CheckoutSubscriptionService,
  ) { }

  ngAfterViewInit(): void {
    const quantity = this.getParamMapQuantity();
    this.setQuantity(quantity);
    const productID = this.getParamMapProductID();
    if ( this.checkoutDetailsComponent != undefined && quantity) {
      this.createCheckoutSubscription(productID, this.checkoutDetailsComponent.getQuantity());
    }
    else {
      this.logService.error("Can not get productID or Quantity.")
    }
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

  startSubscription(quantity: number): void {
    if ( this.stripePaymentElementComponent ) {
      this.snackBarService.error("Checking if quantity was updated and subscriptions needs to be updated: " + quantity)


      const submitStripePayment: SubmitStripePayment = {
        return_url : "https://scalecloud.de/checkout/status",
      }

     

      this.stripePaymentElementComponent.submitIntent(submitStripePayment);
    }
    else {
      this.logService.error("PaymentElementComponent is undefined.")
    }
  }

  initCheckoutProduct(subscriptionID: string): void {
    if (!subscriptionID) {
      this.logService.error("subscriptionID is undefined.");
    }
    else {
      if (this.checkoutDetailsComponent) {
        this.checkoutDetailsComponent.initCheckoutProduct(subscriptionID);
      }
      else {
        this.logService.error("CheckoutDetailsComponent is undefined.")
      }
    }
  }


  createCheckoutSubscription(productID: string | undefined, quantity: number | undefined): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        if (productID && quantity) {
          const checkoutModelPortalRequest: CheckoutModelPortalRequest = {
            productID: productID,
            quantity: quantity,
          }

          const observable = this.checkoutSubscriptionService.createCheckoutSubscription(checkoutModelPortalRequest).subscribe(
            (checkoutIntegrationReply: CheckoutIntegrationReply) => {
              this.checkoutIntegrationReply = checkoutIntegrationReply;

              const initStripePayment : InitStripePayment  = {
                intent: StripeIntent.SetupIntent,
                client_secret: checkoutIntegrationReply.clientSecret,
                email: checkoutIntegrationReply.email
              } 

              this.stripePaymentElementComponent.initPaymentElement(initStripePayment);
              this.initCheckoutProduct(checkoutIntegrationReply.subscriptionID);
            });
        }
        else {
          this.logService.error('productID: ' + productID + ' or quantity: ' + quantity + ' not defined');
        }
      }
    }
    );
  }

  
  getSubscriptionID(): string | undefined {
    if (this.checkoutIntegrationReply) {
      return this.checkoutIntegrationReply.subscriptionID;
    }
    else {
      return undefined;
    }
  }

}
