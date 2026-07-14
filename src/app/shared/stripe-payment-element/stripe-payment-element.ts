import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import {
  loadStripe,
  type Stripe,
  type StripeElements,
  type StripeAddressElement,
  type StripePaymentElement as StripeJsPaymentElement,
} from '@stripe/stripe-js';
import { InitStripePayment, StripeIntent, SubmitStripePayment } from './stripe-payment-setup-intent-model';
import { ServiceStatus } from 'src/app/shared/client-status';
import { MatCard, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatList, MatListItem } from '@angular/material/list';

import { FormsModule } from '@angular/forms';
import { LoadingFailed } from '../loading-failed/loading-failed';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { StripeKey } from 'src/app/core/stripe/stripe-key';

@Component({
    selector: 'app-stripe-payment-element',
    templateUrl: './stripe-payment-element.html',
    styleUrls: ['./stripe-payment-element.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatProgressBar, MatCardSubtitle, NgxSkeletonLoaderComponent, MatCardContent, MatList, MatListItem, FormsModule, LoadingFailed]
})
export class StripePaymentElement {
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly stripeKey = inject(StripeKey);

  readonly ServiceStatus = ServiceStatus;
  readonly serviceStatus = signal<ServiceStatus>(ServiceStatus.Loading);

  private stripe: Stripe | undefined;
  elements: StripeElements | undefined;
  initStripePayment: InitStripePayment | undefined;

  async initPaymentElement(initStripePayment: InitStripePayment): Promise<void> {
    const publicKey = this.stripeKey.getPublicKey();
    if (publicKey == undefined) {
      this.log.error("Cannot display Payment because publicKey is undefined.")
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    const stripe = await loadStripe(publicKey);
    if (stripe == null) {
      this.log.error("Cannot display Payment because Stripe.js failed to load.")
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    this.stripe = stripe;
    this.initStripePayment = initStripePayment;

    const options = {
      clientSecret: this.initStripePayment.client_secret,
      // Fully customizable with appearance API.
      appearance: {/*...*/ },
    };

    this.elements = this.stripe.elements(options);

    const paymentElement: StripeJsPaymentElement = this.elements.create('payment');
    paymentElement.mount('#payment-element');

    const addressElement: StripeAddressElement = this.elements.create('address', {
      mode: 'billing',
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
    addressElement.mount('#address-element');

    addressElement.on('ready', () => {
      this.serviceStatus.set(ServiceStatus.Success);
    });

    addressElement.on('loaderror', (event) => {
      this.serviceStatus.set(ServiceStatus.Error);
      this.snackBar.error("Error loading Stripe: " + event.error?.message);
    });
  }

  async submitIntent(submitStripePayment: SubmitStripePayment): Promise<void> {
    const elements = this.elements;

    if (this.initStripePayment == undefined || this.stripe == undefined || elements == undefined) {
      this.log.error("Cannot submit Payment because initStripePayment is undefined.")
    }
    else if (this.initStripePayment.intent == StripeIntent.SetupIntent) {
      const { error: stripeError } = await this.stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: submitStripePayment.return_url,
        }
      });
      if (stripeError) {
        this.snackBar.error(stripeError.message);
      }
    }
    else if (this.initStripePayment.intent == StripeIntent.PaymentIntent) {
      const { error: stripeError } = await this.stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: submitStripePayment.return_url,
        }
      });
      if (stripeError) {
        this.snackBar.error(stripeError.message);
      }
    }
  }
}