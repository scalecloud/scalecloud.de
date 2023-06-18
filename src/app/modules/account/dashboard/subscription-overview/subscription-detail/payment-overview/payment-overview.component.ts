import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SubscriptionPaymentMethodReply, SubscriptionPaymentMethodRequest } from './subscription-payment-method';
import { SubscriptionPaymentMethodService } from './subscription-payment-method.service';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.scss']
})
export class PaymentOverviewComponent {

  subscriptionPaymentMethodReply: SubscriptionPaymentMethodReply | undefined;

  constructor(
    private logService: LogService,
    private subscriptionPaymentMethodService: SubscriptionPaymentMethodService,
    private authService: AuthService
  ) { }

  getSubscriptionPaymentMethod(subscriptionID: string): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        if (!subscriptionID) {
          this.logService.error("PaymentOverviewComponent.getSubscriptionPaymentMethod: subscriptionID is null");
        }
        else {
          let subscriptionPaymentMethodRequest: SubscriptionPaymentMethodRequest = {
            id: subscriptionID
          }
          const observable = this.subscriptionPaymentMethodService.getSubscriptionPaymentMethod(subscriptionPaymentMethodRequest).subscribe(
            (subscriptionPaymentMethodReply: SubscriptionPaymentMethodReply) => {
              this.subscriptionPaymentMethodReply = subscriptionPaymentMethodReply;
            });
        }
      }
    });
  }

  getID(): string {
    return 'pm_1NJycCA86yrbtIQrba0rzK9F';
  }

  getPaymentMethod(): string {
    return this.getBrand() + ' ' + this.getLast4() + ' ' + this.getExpiration();
  }

  getBrand(): string {
    let brand = '';
    if (this.subscriptionPaymentMethodReply) {
      brand = this.subscriptionPaymentMethodReply.brand;
    }
    return brand;
  }

  getLast4(): string {
    let last4 = '';
    if (this.subscriptionPaymentMethodReply) {
      last4 = this.subscriptionPaymentMethodReply.last4;
    }
    return last4;
  }

  getExpiration(): string {
    let expiration = '';
    if (this.subscriptionPaymentMethodReply) {
      expiration = 'Expires on ' + this.subscriptionPaymentMethodReply.exp_month + '/' + this.subscriptionPaymentMethodReply.exp_year;
    }
    return expiration;
  }

}
