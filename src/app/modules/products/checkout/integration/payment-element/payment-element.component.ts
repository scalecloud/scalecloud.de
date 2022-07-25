import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutModelPortalRequest } from '../../portal/checkout-model-portal';
import { CheckoutIntegrationReply } from '../checkout-model-integration';
import { CheckoutSubscriptionService } from './checkout-subscription.service';

declare var Stripe: any;

@Component({
  selector: 'app-payment-element',
  templateUrl: './payment-element.component.html',
  styleUrls: ['./payment-element.component.scss']
})
export class PaymentElementComponent implements OnInit {

  @Input() productID: string | undefined;
  quantity: number | undefined;
  checkoutIntegrationReply: CheckoutIntegrationReply | undefined;
  readonly publicKeyTest: string = "pk_test_51Gv4psA86yrbtIQrTHaoHoe5ssyYqEYd6N9Uc8xxodxLFDb19cV5ORUqAeH3Y09sghwvN52lzNt111GIxw7W8sLo00TyE22PC3"

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private checkoutSubscriptionService: CheckoutSubscriptionService
  ) { }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.createCheckoutSubscription();
      }
    }
    );
  }

  createCheckoutSubscription(): void {
    if (this.productID && this.quantity) {
      const checkoutModelPortalRequest: CheckoutModelPortalRequest = {
        productID: this.productID,
        quantity: this.quantity,
      }

      let secret = this.checkoutSubscriptionService.createCheckoutSubscription(checkoutModelPortalRequest).subscribe(checkoutIntegrationReply => {
        this.checkoutIntegrationReply = checkoutIntegrationReply;
        this.initPaymentElements();
      });
    }
    else {
      this.logService.error('productID or quantity not defined');
    }
  }

  initPaymentElements(): void {
    // Your Stripe public key
    const stripe = Stripe(this.publicKeyTest);
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
          } else {
            displayError.textContent = '';
          }
        }
      });

      const form = document.getElementById('payment-form');
      if( form ) {
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
