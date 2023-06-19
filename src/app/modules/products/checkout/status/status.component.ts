import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { StripeKeyService } from 'src/app/shared/services/stripe/key-service/stripe-key.service';

declare const Stripe: any;

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {

  setup_intent: string | undefined;
  setup_intent_client_secret: string | undefined;
  redirect_status: string | undefined;

  message: string = "Loading...";

  loading: boolean = true;
  succeeded: boolean = false;
  processing: boolean = false;
  requires_payment_method: boolean = false;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private stripeKeyService: StripeKeyService
  ) { }

  ngAfterViewInit(): void {
    this.waitForAuth();
  }

  initParamMap(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('setup_intent')) {
      const setup_intent = queryParamMap.get('setup_intent');
      if (setup_intent) {
        this.setup_intent = setup_intent;
      }
    }
    if (queryParamMap.has('setup_intent_client_secret')) {
      const setup_intent_client_secret = queryParamMap.get('setup_intent_client_secret');
      if (setup_intent_client_secret) {
        this.setup_intent_client_secret = setup_intent_client_secret;
      }
    }
    if (queryParamMap.has('redirect_status')) {
      const redirect_status = queryParamMap.get('redirect_status');
      if (redirect_status) {
        this.redirect_status = redirect_status;
      }
    }
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.checkPaymentIntentStatus();
      }
    });
  }

  checkPaymentIntentStatus(): void {
    // Your Stripe public key
    const publicKey = this.stripeKeyService.getPublicKey();
    if (publicKey == undefined) {
      this.logService.error("Cannot display status because publicKey is undefined.")
    }
    else {
      // Initialize Stripe.js using your publishable key
      const stripe = Stripe(publicKey);


      // Retrieve the "payment_intent_client_secret" query parameter appended to
      // your return_url by Stripe.js
      this.initParamMap();

      // Check if param is defined
      if (this.setup_intent_client_secret == undefined) {
        this.logService.error("Cannot display status because setup_intent_client_secret is undefined.")
      }
      else if (this.setup_intent == undefined) {
        this.logService.error("Cannot display status because setup_intent is undefined.")
      }
      else if (this.redirect_status == undefined) {
        this.logService.error("Cannot display status because redirect_status is undefined.")
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
          //this.setupIntent = setupIntent;
          this.loading = false;
          switch (setupIntent.status) {
            case 'succeeded': {
              this.logService.info("Success! Your payment method has been saved.")
              this.succeeded = true;
              break;
            }

            case 'processing': {
              this.logService.warn("Processing payment details. We'll update you when processing is complete.")
              this.processing = true;
              break;
            }

            case 'requires_payment_method': {
              this.logService.error("Failed to process payment details. Please try another payment method.")
              this.requires_payment_method = true;

              // Redirect your user back to your payment page to attempt collecting
              // payment again

              break;
            }
          }
        });
      }

    }
  }

}
