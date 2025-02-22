import { Component } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { InitStripePayment, StripeIntent, SubmitStripePayment } from './stripe-payment-setup-intent';
import { StripeKeyService } from 'src/app/shared/services/stripe/key-service/stripe-key.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';

declare const Stripe: any;

@Component({
    selector: 'app-stripe-payment-element',
    templateUrl: './stripe-payment-element.component.html',
    styleUrls: ['./stripe-payment-element.component.scss'],
    standalone: false
})
export class StripePaymentElementComponent {
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Loading;
  stripeElement: any;
  elements: any;
  initStripePayment: InitStripePayment | undefined;

  constructor(
    private readonly logService: LogService,
    private readonly snackBarService: SnackBarService,
    private readonly stripeKeyService: StripeKeyService
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
      const addressElement = this.elements.create('payment');
      addressElement.mount('#payment-element');

      const paymentElement = this.elements.create("address", {
        mode: "billing",
        blockPoBox: true,
        fields: {
          phone: 'always',
        },
        validation: {
          phone: {
            required: 'always',
          },
        },
      });
      paymentElement.mount('#address-element');

      paymentElement.on('ready', () => {
        this.serviceStatus = ServiceStatus.Success;
      });

      paymentElement.on('error', (event: any) => {
        this.serviceStatus = ServiceStatus.Error;
        this.snackBarService.error("Error loading Stripe: " + event.error.message);
      });

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