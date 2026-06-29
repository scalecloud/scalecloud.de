import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { StripeKeyService } from 'src/app/shared/services/stripe/key-service/stripe-key.service';
import { PaymentChangedSucceededComponent } from './payment-changed-succeeded/payment-changed-succeeded.component';
import { PaymentChangedProcessingComponent } from './payment-changed-processing/payment-changed-processing.component';
import { PaymentChangedRequiresPaymentMethodComponent } from './payment-changed-requires-payment-method/payment-changed-requires-payment-method.component';

declare const Stripe: any;

@Component({
    selector: 'app-status-payment-changed',
    templateUrl: './status-payment-changed.component.html',
    styleUrls: ['./status-payment-changed.component.scss'],
    imports: [PaymentChangedSucceededComponent, PaymentChangedProcessingComponent, PaymentChangedRequiresPaymentMethodComponent]
})
export class StatusPaymentChangedComponent implements OnInit {
  private readonly logService = inject(LogService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly stripeKeyService = inject(StripeKeyService);

  setup_intent: string | undefined;
  setup_intent_client_secret: string | undefined;
  redirect_status: string | undefined;

  message = 'Loading...';

  // These drive the template, and are updated from inside promise callbacks
  // (waitForAuth / retrieveSetupIntent). Under zoneless change detection,
  // plain field mutations inside .then() are invisible to Angular, so these
  // must be signals to trigger a view update when they change.
  loading = signal(true);
  succeeded = signal(false);
  processing = signal(false);
  requires_payment_method = signal(false);

  ngOnInit(): void {
    this.checkPaymentIntentStatus();
  }

  initParamMap(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.setup_intent = queryParamMap.get('setup_intent') ?? undefined;
    this.setup_intent_client_secret = queryParamMap.get('setup_intent_client_secret') ?? undefined;
    this.redirect_status = queryParamMap.get('redirect_status') ?? undefined;
  }

  checkPaymentIntentStatus(): void {
    this.authService.waitForAuth().then(() => {
      // Your Stripe public key
      const publicKey = this.stripeKeyService.getPublicKey();
      if (publicKey == undefined) {
        this.logService.error('Cannot display status because publicKey is undefined.');
      }
      else {
        // Initialize Stripe.js using your publishable key
        const stripe = Stripe(publicKey);

        // Retrieve the "payment_intent_client_secret" query parameter appended to
        // your return_url by Stripe.js
        this.initParamMap();

        // Check if param is defined
        if (this.setup_intent_client_secret == undefined) {
          this.logService.error('Cannot display status because setup_intent_client_secret is undefined.');
        }
        else if (this.setup_intent == undefined) {
          this.logService.error('Cannot display status because setup_intent is undefined.');
        }
        else if (this.redirect_status == undefined) {
          this.logService.error('Cannot display status because redirect_status is undefined.');
        }
        else {
          // Retrieve the SetupIntent
          stripe.retrieveSetupIntent(this.setup_intent_client_secret).then(({ setupIntent }: any) => {
            // Inspect the SetupIntent `status` to indicate the status of the payment
            // to your customer.
            //
            // Some payment methods will [immediately succeed or fail][0] upon
            // confirmation, while others will first enter a `processing` state.
            //
            // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
            this.loading.set(false);
            switch (setupIntent.status) {
              case 'succeeded': {
                this.logService.info('Success! Your payment method has been saved.');
                this.succeeded.set(true);
                break;
              }

              case 'processing': {
                this.logService.warn("Processing payment details. We'll update you when processing is complete.");
                this.processing.set(true);
                break;
              }

              case 'requires_payment_method': {
                this.logService.error('Failed to process payment details. Please try another payment method.');
                this.requires_payment_method.set(true);

                // Redirect your user back to your payment page to attempt collecting
                // payment again

                break;
              }
            }
          });
        }
      }
    }).catch((error) => {
      this.logService.error('waitForAuth failed: ' + error);
    });
  }
}