import { Component, ViewChild } from '@angular/core';
import { ISubscriptionDetail } from '../subscription-detail';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SubscriptionDetailService } from '../subscription-detail.service';
import { ChangePaymentReply, ChangePaymentRequest } from './change-payment';
import { ChangePaymentService } from './change-payment.service';
import { InitStripePayment, StripeIntent, SubmitStripePayment } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-setup-intent';
import { StripePaymentElementComponent } from 'src/app/shared/components/stripe/stripe-payment-element/stripe-payment-element.component';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-change-payment',
  templateUrl: './change-payment.component.html',
  styleUrls: ['./change-payment.component.scss']
})
export class ChangePaymentComponent {

  @ViewChild(StripePaymentElementComponent) stripePaymentElementComponent: StripePaymentElementComponent | undefined;

  subscriptionSetupIntentReply: ChangePaymentReply | undefined;
  subscriptionDetail: ISubscriptionDetail | undefined;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private subscriptionDetailService: SubscriptionDetailService,
    private logService: LogService,
    private changePaymentService: ChangePaymentService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getChangePaymentSetupIntent();
        this.reloadSubscriptionDetail();
      }
    }
    );
  }

  reloadSubscriptionDetail(): void {
    const id = this.getID();
    if (id != null) {
      this.subscriptionDetailService.getSubscriptionDetail(id)
        .subscribe(subscriptionDetail => this.subscriptionDetail = subscriptionDetail);
    }
  }

  getChangePaymentSetupIntent(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        const id = this.getID();
        if (id != null) {
          let subscriptionSetupIntentRequest: ChangePaymentRequest = {
            subscriptionid: id
          }
          const observable = this.changePaymentService.getChangePaymentSetupIntent(subscriptionSetupIntentRequest).subscribe(
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
      }
    });
  }

  getID(): string {
    let id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      this.logService.error('SubscriptionPaymentMethodComponent.getID: id is null');
    }
    return id;
  }

  changePaymentMethod(): void {
    if (this.stripePaymentElementComponent) {
      
      const submitStripePayment: SubmitStripePayment = {
        return_url: "https://www.scalecloud.de/dashboard/status",
      }
      this.stripePaymentElementComponent.submitIntent(submitStripePayment);
    }
    else {
      this.logService.error("PaymentElementComponent is undefined.")
    }
  }


}
