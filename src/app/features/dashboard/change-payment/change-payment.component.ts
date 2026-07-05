import { Component, ChangeDetectionStrategy, inject, OnInit, viewChild, signal, WritableSignal } from '@angular/core';
import { ChangePaymentReply } from './change-payment';
import { ChangePaymentService } from './change-payment.service';
import { InitStripePayment, StripeIntent, SubmitStripePayment } from 'src/app/shared/stripe-payment-element/stripe-payment-setup-intent';
import { StripePaymentElementComponent } from 'src/app/shared/stripe-payment-element/stripe-payment-element.component';
import { ServiceStatus } from 'src/app/shared/service-status';
import { StripePaymentElementComponent as StripePaymentElementComponent_1 } from '../../../shared/stripe-payment-element/stripe-payment-element.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { afterNextRender } from '@angular/core';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';

@Component({
    selector: 'app-change-payment',
    templateUrl: './change-payment.component.html',
    styleUrls: ['./change-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StripePaymentElementComponent_1, MatButton, MatIcon]
})
export class ChangePaymentComponent implements OnInit {
  private readonly auth = inject(Auth);
  private readonly log = inject(Log);
  private readonly changePaymentService = inject(ChangePaymentService);
  private readonly returnUrlService = inject(ReturnUrlService);

  private readonly _stripePaymentElementComponentRef = viewChild(StripePaymentElementComponent);

  // Writable signal so tests can set it to undefined to exercise guard branches.
  stripePaymentElementComponent: WritableSignal<StripePaymentElementComponent | undefined> =
    signal(undefined);

  subscriptionSetupIntentReply: ChangePaymentReply | undefined;

  constructor() {
    afterNextRender(() => {
      this.stripePaymentElementComponent.set(this._stripePaymentElementComponentRef());
    });
  }

  ngOnInit(): void {
    // Fire-and-forget from the lifecycle hook is fine; errors are handled and
    // logged inside getChangePaymentSetupIntent itself.
    void this.getChangePaymentSetupIntent();
  }

  // Returns the underlying promise so callers (and tests) can await
  // completion of the whole async flow, including the error branch.
  getChangePaymentSetupIntent(): Promise<void> {
    return this.auth.waitForAuth().then(() => {
      this.changePaymentService.getChangePaymentSetupIntent().subscribe(
        (subscriptionSetupIntentReply: ChangePaymentReply) => {
          this.subscriptionSetupIntentReply = subscriptionSetupIntentReply;

          const initStripePayment: InitStripePayment = {
            intent: StripeIntent.SetupIntent,
            client_secret: subscriptionSetupIntentReply.clientsecret,
            email: subscriptionSetupIntentReply.email,
          };

          this.stripePaymentElementComponent()?.initPaymentElement(initStripePayment);
        });
    }).catch((error) => {
      this.log.error('waitForAuth failed: ' + error);
    });
  }

  changePaymentMethod(): void {
    const stripePaymentElementComponent = this.stripePaymentElementComponent();
    if (stripePaymentElementComponent) {
      const returnUrl = this.returnUrlService.getSpecifiedUrlWithReturnUrl('/dashboard/change-payment/status');
      this.log.info('returnUrl: ' + returnUrl);
      const submitStripePayment: SubmitStripePayment = {
        return_url: returnUrl,
      };
      stripePaymentElementComponent.submitIntent(submitStripePayment);
    } else {
      this.log.error('PaymentElementComponent is undefined.');
    }
  }

  cancel(): void {
    this.returnUrlService.openReturnURL('/dashboard');
  }

  isSuccess(): boolean {
    return this.stripePaymentElementComponent()?.serviceStatus === ServiceStatus.Success;
  }
}