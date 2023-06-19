import { Component } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { StripeKeyService } from 'src/app/shared/services/stripe/stripe-key.service';
import { InitStripePayment as InitPaymentElementStruct, Intent, SubmitStripePayment as SubmitIntentStruct } from './stripe-payment-setup-intent';

declare const Stripe: any;

@Component({
  selector: 'app-stripe-payment-element',
  templateUrl: './stripe-payment-element.component.html',
  styleUrls: ['./stripe-payment-element.component.scss']
})
export class StripePaymentElementComponent {
  stripeElement: any;
  elements: any;
  initPaymentElementStruct: InitPaymentElementStruct | undefined;

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
    private stripeKeyService: StripeKeyService
  ) { }

  initPaymentElement(initPaymentElementStruct: InitPaymentElementStruct): void {
    // Your Stripe public key
    const publicKey = this.stripeKeyService.getPublicKey();
    if (publicKey == undefined) {
      this.logService.error("Cannot display Payment because publicKey is undefined.")
    }
    else {
      this.stripeElement = Stripe(publicKey);
    }
    this.initPaymentElementStruct = initPaymentElementStruct;
    if (this.initPaymentElementStruct) {
      const options = {
        clientSecret: this.initPaymentElementStruct.client_secret,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
      };

      this.elements = this.stripeElement.elements(options);
      const paymentElement = this.elements.create('payment');
      paymentElement.mount('#payment-element');

      // Create and mount the linkAuthentication Element to enable autofilling customer payment details
      const linkAuthenticationElement = this.elements.create("linkAuthentication");
      linkAuthenticationElement.mount("#link-authentication-element");
      // If the customer's email is known when the page is loaded, you can
      // pass the email to the linkAuthenticationElement on mount:
      //
      if (this.initPaymentElementStruct.customer_email != undefined) {
        linkAuthenticationElement.mount("#link-authentication-element", {
          defaultValues: {
            email: this.initPaymentElementStruct.customer_email,
          }
        })
      }
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
    }
  }

  async submitIntent(submitIntentStruct: SubmitIntentStruct): Promise<void> {
    const elements = this.elements
    let error = undefined;
    if (this.initPaymentElementStruct == undefined) {
      this.logService.error("Cannot submit Payment because initStripePayment is undefined.")
      return;
    }
    else if (this.initPaymentElementStruct.intent == Intent.SetupIntent) {
      error = await this.stripeElement.confirmSetup({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: submitIntentStruct.return_url,
        }
      });
    }
    else if (this.initPaymentElementStruct.intent == Intent.PaymentIntent) {
      error = await this.stripeElement.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: submitIntentStruct.return_url,
        }
      });
    }
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
  }
}