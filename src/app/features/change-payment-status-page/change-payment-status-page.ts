import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { Succeeded } from './succeeded/succeeded';
import { Processing } from './processing/processing';
import { RequiresPaymentMethod } from './requires-payment-method/requires-payment-method';
import { Log } from 'src/app/core/logging/log';
import { StripeKey } from 'src/app/core/stripe/stripe-key';

@Component({
    selector: 'app-change-payment-status-page',
    templateUrl: './change-payment-status-page.html',
    styleUrls: ['./change-payment-status-page.scss'],
    imports: [Succeeded, Processing, RequiresPaymentMethod]
})
export class ChangePaymentStatusPage implements OnInit {
  private readonly log = inject(Log);
  private readonly route = inject(ActivatedRoute);
  private readonly stripeKey = inject(StripeKey);

  setup_intent: string | undefined;
  setup_intent_client_secret: string | undefined;
  redirect_status: string | undefined;

  message = 'Loading...';

  // These drive the template and are updated after awaiting Stripe. Under zoneless change
  // detection, plain field mutations after an await are invisible to Angular, so these must
  // be signals to trigger a view update when they change.
  loading = signal(true);
  succeeded = signal(false);
  processing = signal(false);
  requires_payment_method = signal(false);

  ngOnInit(): void {
    void this.checkPaymentIntentStatus();
  }

  initParamMap(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.setup_intent = queryParamMap.get('setup_intent') ?? undefined;
    this.setup_intent_client_secret = queryParamMap.get('setup_intent_client_secret') ?? undefined;
    this.redirect_status = queryParamMap.get('redirect_status') ?? undefined;
  }

  // No auth waiting: this page only talks to Stripe with the client secret from the URL,
  // not to our API. That is why the route /checkout/status can stay unguarded.
  // Stripe.js is loaded with loadStripe(), which resolves once the script is really available.
  // The global `Stripe` must not be used directly: on a fresh page load after Stripe's redirect
  // it may not exist yet.
  async checkPaymentIntentStatus(): Promise<void> {
    const publicKey = this.stripeKey.getPublicKey();
    if (publicKey == undefined) {
      this.log.error('Cannot display status because publicKey is undefined.');
      return;
    }

    // Retrieve the query parameters appended to your return_url by Stripe.js
    this.initParamMap();

    if (this.setup_intent_client_secret == undefined) {
      this.log.error('Cannot display status because setup_intent_client_secret is undefined.');
      return;
    }
    if (this.setup_intent == undefined) {
      this.log.error('Cannot display status because setup_intent is undefined.');
      return;
    }
    if (this.redirect_status == undefined) {
      this.log.error('Cannot display status because redirect_status is undefined.');
      return;
    }

    try {
      const stripe = await loadStripe(publicKey);
      if (stripe == null) {
        this.log.error('Cannot display status because Stripe.js could not be loaded.');
        return;
      }

      const { setupIntent, error } = await stripe.retrieveSetupIntent(this.setup_intent_client_secret);
      if (error || !setupIntent) {
        this.log.error('retrieveSetupIntent failed: ' + (error?.message ?? 'no setupIntent returned'));
        return;
      }

      // Inspect the SetupIntent `status` to indicate the status of the payment to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon confirmation, while
      // others will first enter a `processing` state.
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
          break;
        }
      }
    } catch (error: unknown) {
      this.log.error('retrieveSetupIntent failed: ' + (error as Error).message);
    }
  }
}