import { Component, ViewChild, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ChangePaymentReply } from './change-payment';
import { ChangePaymentService } from './change-payment.service';
import { InitStripePayment, StripeIntent, SubmitStripePayment } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-setup-intent';
import { StripePaymentElementComponent } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-element.component';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { StripePaymentElementComponent as StripePaymentElementComponent_1 } from '../../../../shared/components/stripe/stripe-payment-element/stripe-payment-element.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-change-payment',
    templateUrl: './change-payment.component.html',
    styleUrls: ['./change-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StripePaymentElementComponent_1, MatButton, MatIcon]
})
export class ChangePaymentComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly logService = inject(LogService);
  private readonly changePaymentService = inject(ChangePaymentService);
  private readonly returnUrlService = inject(ReturnUrlService);

  @ViewChild(StripePaymentElementComponent) stripePaymentElementComponent: StripePaymentElementComponent | undefined;
  subscriptionSetupIntentReply: ChangePaymentReply | undefined;

  ngOnInit(): void {
    this.getChangePaymentSetupIntent();
  }

  getChangePaymentSetupIntent(): void {
    this.authService.waitForAuth().then(() => {
      this.changePaymentService.getChangePaymentSetupIntent().subscribe(
        (subscriptionSetupIntentReply: ChangePaymentReply) => {
          this.subscriptionSetupIntentReply = subscriptionSetupIntentReply;

          const initStripePayment: InitStripePayment = {
            intent: StripeIntent.SetupIntent,
            client_secret: subscriptionSetupIntentReply.clientsecret,
            email: subscriptionSetupIntentReply.email
          }

          this.stripePaymentElementComponent.initPaymentElement(initStripePayment);
        });
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  changePaymentMethod(): void {
    if (this.stripePaymentElementComponent) {
      const returnUrl = this.returnUrlService.getSpecifiedUrlWithReturnUrl('/dashboard/change-payment/status');
      this.logService.info("returnUrl: " + returnUrl);
      const submitStripePayment: SubmitStripePayment = {
        return_url: returnUrl,
      }
      this.stripePaymentElementComponent.submitIntent(submitStripePayment);
    }
    else {
      this.logService.error("PaymentElementComponent is undefined.")
    }
  }

  cancel(): void {
    this.returnUrlService.openReturnURL("/dashboard");
  }

  isSuccess(): boolean {
    return this.stripePaymentElementComponent?.serviceStatus == ServiceStatus.Success;
  }

}
