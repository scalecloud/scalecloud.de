import { Component } from '@angular/core';
import { SubscriptionSetupIntentReply, SubscriptionSetupIntentRequest } from '../../change-payment';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ChangePaymentService } from '../../change-payment.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { StripeKeyService } from 'src/app/shared/services/stripe/key-service/stripe-key.service';

declare const Stripe: any;

@Component({
  selector: 'app-change-payment-element',
  templateUrl: './change-payment-element.component.html',
  styleUrls: ['./change-payment-element.component.scss']
})
export class ChangePaymentElementComponent {

  
  subscriptionSetupIntentReply: SubscriptionSetupIntentReply | undefined;
  stripeElement: any;
  elements: any;

  constructor(
    private logService: LogService,
    private snackBarService: SnackBarService,
    private changePaymentService: ChangePaymentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private stripeKeyService: StripeKeyService
  ) { }

  ngAfterViewInit(): void {
    this.getSetupIntent();
  }

  getSetupIntent(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id == null) {
          this.logService.error('SubscriptionPaymentMethodComponent.getSubscriptionPaymentMethod: id is null');
        } else {
          if (!id) {
            this.logService.error('SubscriptionPaymentMethodComponent.getSubscriptionPaymentMethod: id is null');
          }
          else {
            let subscriptionSetupIntentRequest: SubscriptionSetupIntentRequest = {
              subscriptionid: id
            }
            const observable = this.changePaymentService.getSubscriptionSetupIntent(subscriptionSetupIntentRequest).subscribe(
              (subscriptionSetupIntentReply: SubscriptionSetupIntentReply) => {
                this.subscriptionSetupIntentReply = subscriptionSetupIntentReply;
                this.initPaymentElements();
              });
          }
        }
      }
    });
  }

  initPaymentElements(): void {
    // Your Stripe public key
    const publicKey = this.stripeKeyService.getPublicKey();
    if (publicKey == undefined) {
      this.logService.error("Cannot display Payment because publicKey is undefined.")
    }
    else {
      this.stripeElement = Stripe(publicKey);
    }
    if (this.subscriptionSetupIntentReply) {
      const options = {
        clientSecret: this.subscriptionSetupIntentReply.clientsecret,
        // Fully customizable with appearance API.
        appearance: {/*...*/ },
      };

      this.elements = this.stripeElement.elements(options);
      const paymentElement = this.elements.create('payment');
      paymentElement.mount('#payment-element');

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

}
