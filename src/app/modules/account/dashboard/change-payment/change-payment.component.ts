import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ChangePaymentReply } from './change-payment';
import { ChangePaymentService } from './change-payment.service';
import { InitStripePayment, StripeIntent, SubmitStripePayment } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-setup-intent';
import { StripePaymentElementComponent } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-element.component';

@Component({
  selector: 'app-change-payment',
  templateUrl: './change-payment.component.html',
  styleUrls: ['./change-payment.component.scss']
})
export class ChangePaymentComponent {

  @ViewChild(StripePaymentElementComponent) stripePaymentElementComponent: StripePaymentElementComponent | undefined;

  subscriptionSetupIntentReply: ChangePaymentReply | undefined;

  constructor(
    public authService: AuthService,
    private logService: LogService,
    private changePaymentService: ChangePaymentService
  ) { }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getChangePaymentSetupIntent();
      }
    }
    );
  }

  getChangePaymentSetupIntent(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
          const observable = this.changePaymentService.getChangePaymentSetupIntent().subscribe(
            (subscriptionSetupIntentReply: ChangePaymentReply) => {
              this.subscriptionSetupIntentReply = subscriptionSetupIntentReply;

              const initStripePayment: InitStripePayment = {
                intent: StripeIntent.SetupIntent,
                client_secret: subscriptionSetupIntentReply.clientsecret,
                email: subscriptionSetupIntentReply.email
              }

              this.stripePaymentElementComponent.initPaymentElement(initStripePayment);
            });
        }
    });
  }

  changePaymentMethod(): void {
    if (this.stripePaymentElementComponent) {
      const submitStripePayment: SubmitStripePayment = {
        return_url: "https://www.scalecloud.de/dashboard/change-payment/status",
      }
      this.stripePaymentElementComponent.submitIntent(submitStripePayment);
    }
    else {
      this.logService.error("PaymentElementComponent is undefined.")
    }
  }


}
