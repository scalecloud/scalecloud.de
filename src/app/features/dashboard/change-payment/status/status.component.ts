import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeKeyService } from 'src/app/core/stripe/stripe-key.service';
import { SucceededComponent } from './succeeded/succeeded.component';
import { ProcessingComponent } from './processing/processing.component';
import { RequiresPaymentMethodComponent } from './requires-payment-method/requires-payment-method.component';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';

declare const Stripe: any;

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss'],
    imports: [SucceededComponent, ProcessingComponent, RequiresPaymentMethodComponent]
})
export class StatusComponent implements OnInit {
  private readonly log = inject(Log);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(Auth);
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
    this.auth.waitForAuth().then(() => {
      // Your Stripe public key
      const publicKey = this.stripeKeyService.getPublicKey();
      if (publicKey == undefined) {
        this.log.error('Cannot display status because publicKey is undefined.');
      }
      else {
        // Initialize Stripe.js using your publishable key
        const stripe = Stripe(publicKey);

        // Retrieve the "payment_intent_client_secret" query parameter appended to
        // your return_url by Stripe.js
        this.initParamMap();

        // Check if param is defined
        if (this.setup_intent_client_secret == undefined) {
          this.log.error('Cannot display status because setup_intent_client_secret is undefined.');
        }
        else if (this.setup_intent == undefined) {
          this.log.error('Cannot display status because setup_intent is undefined.');
        }
        else if (this.redirect_status == undefined) {
          this.log.error('Cannot display status because redirect_status is undefined.');
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
                this.log.info('Success! Your payment method has been saved.');
                this.succeeded.set(true);
                break;
              }

              case 'processing': {
                this.log.warn("Processing payment details. We'll update you when processing is complete.");
                this.processing.set(true);
                break;
              }

              case 'requires_payment_method': {
                this.log.error('Failed to process payment details. Please try another payment method.');
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
      this.log.error('waitForAuth failed: ' + error);
    });
  }
}