import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { StripeKeyService } from 'src/app/shared/services/stripe/stripe-key.service';
import { CheckoutModelPortalRequest } from '../../portal/checkout-model-portal';
import { CheckoutIntegrationReply } from '../checkout-model-integration';
import { CheckoutSubscriptionService } from './checkout-subscription.service';

declare const Stripe: any;

@Component({
  selector: 'app-payment-element',
  templateUrl: './payment-element.component.html',
  styleUrls: ['./payment-element.component.scss']
})
export class PaymentElementComponent {

  checkoutIntegrationReply: CheckoutIntegrationReply | undefined;

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private checkoutSubscriptionService: CheckoutSubscriptionService,
    private stripeKeyService: StripeKeyService
  ) { }

  createCheckoutSubscription(productID: string | undefined, quantity: number | undefined): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        if (productID && quantity) {
          const checkoutModelPortalRequest: CheckoutModelPortalRequest = {
            productID: productID,
            quantity: quantity,
          }

          const observable = this.checkoutSubscriptionService.createCheckoutSubscription(checkoutModelPortalRequest).subscribe(checkoutIntegrationReply => {
            this.checkoutIntegrationReply = checkoutIntegrationReply;
            this.initPaymentElements();
          });
        }
        else {
          this.logService.error('productID: ' + productID + ' or quantity: ' + quantity + ' not defined');
        }
      }
    }
    );
  }

  getPrice(): number {
    return 10;
  }

  initPaymentElements(): void {
    // Your Stripe public key
    const publicKey = this.stripeKeyService.getPublicKey();
    if (publicKey == undefined) {
      this.logService.error("Cannot display Payment because publicKey is undefined.")
    }
    else {
      const stripe = Stripe(publicKey);
      if (this.checkoutIntegrationReply) {
        const options = {
          clientSecret: this.checkoutIntegrationReply.clientSecret,
          // Fully customizable with appearance API.
          appearance: {/*...*/ },
        };

        const elements = stripe.elements(options);
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');

        paymentElement.addEventListener('change', (event: { error: { message: string | null; }; }) => {
          const displayError = document.getElementById('card-errors');
          if (displayError) {
            if (event.error) {
              displayError.textContent = event.error.message;
              if (displayError.textContent) {
                this.snackBarService.error(displayError.textContent);
              }
            } else {
              displayError.textContent = '';
            }
          }
        });

        const form = document.getElementById('payment-form');
        if (form) {
          form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const { error } = await stripe.confirmPayment({
              //`Elements` instance that was used to create the Payment Element
              elements,
              confirmParams: {
                return_url: "https://www.scalecloud.de/order/123/complete",
              }
            });

            if (error) {
              // This point will only be reached if there is an immediate error when
              // confirming the payment. Show error to your customer (for example, payment
              // details incomplete)
              const messageContainer = document.querySelector('#error-message');
              this.snackBarService.error(error.message);
            } else {
              // Your customer will be redirected to your `return_url`. For some payment
              // methods like iDEAL, your customer will be redirected to an intermediate
              // site first to authorize the payment, then redirected to the `return_url`.
            }
          });
        }
      }
    }
  }

  startSubscription( quantity: number ): void {
    this.logService.info("Checking if quantity was updated and subscriptions needs to be updated: " + quantity);
   
  }

}
