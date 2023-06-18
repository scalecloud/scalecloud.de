import { Component } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SubscriptionPaymentMethodService } from '../payment-overview/subscription-payment-method.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionSetupIntentReply, SubscriptionSetupIntentRequest } from './change-payment';
import { ChangePaymentService } from './change-payment.service';

@Component({
  selector: 'app-change-payment',
  templateUrl: './change-payment.component.html',
  styleUrls: ['./change-payment.component.scss']
})
export class ChangePaymentComponent {

  subscriptionSetupIntentReply: SubscriptionSetupIntentReply | undefined;

  constructor(
    private logService: LogService,
    private changePaymentService: ChangePaymentService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

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
              });
          }
        }
      }
    });
  }

}
