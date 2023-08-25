import { Component } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { InitStripePayment, StripeIntent,  SubmitStripePayment } from './stripe-payment-setup-intent';
import { StripeKeyService } from 'src/app/shared/services/stripe/key-service/stripe-key.service';

declare const Stripe: any;

@Component({
  selector: 'app-stripe-payment-element',
  templateUrl: './stripe-payment-element.component.html',
  styleUrls: ['./stripe-payment-element.component.scss']
})
export class StripePaymentElementComponent {
  stripeElement: any;
  elements: any;
  initStripePayment: InitStripePayment | undefined;

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
    private stripeKeyService: StripeKeyService
  ) { }

  initPaymentElement(initStripePayment: InitStripePayment): void {
    // Your Stripe public key
    const publicKey = this.stripeKeyService.getPublicKey();
    if (publicKey == undefined) {
      this.logService.error("Cannot display Payment because publicKey is undefined.")
    }
    else {
      this.stripeElement = Stripe(publicKey);
    }
    this.initStripePayment = initStripePayment;
    if (this.initStripePayment) {
      const options = {
        clientSecret: this.initStripePayment.client_secret,
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
      if (this.initStripePayment.email != undefined) {
        linkAuthenticationElement.mount("#link-authentication-element", {
          defaultValues: {
            email: this.initStripePayment.email,
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

  async submitIntent(submitStripePayment: SubmitStripePayment): Promise<void> {
    const elements = this.elements

    if (this.initStripePayment == undefined) {
      this.logService.error("Cannot submit Payment because initStripePayment is undefined.")
      return;
    }
    else if (this.initStripePayment.intent == StripeIntent.SetupIntent) {
      const { error: stripeError } = await this.stripeElement.confirmSetup({
        elements,
        confirmParams: {
          return_url: submitStripePayment.return_url,
        }
      });
      if (stripeError) {
        this.snackBarService.error(stripeError.message);
      }
    }
    else if (this.initStripePayment.intent == StripeIntent.PaymentIntent) {
      const { error: stripeError } = await this.stripeElement.confirmPayment({
        elements,
        confirmParams: {
          return_url: submitStripePayment.return_url,
        }
      });
      if (stripeError) {
        this.snackBarService.error(stripeError.message);
      }
    }
  }
}