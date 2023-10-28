import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { PaymentMethodOverviewService } from './payment-method-overview.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.scss']
})
export class PaymentOverviewComponent {

  subscriptionPaymentMethodReply: PaymentMethodOverviewReply | undefined;

  constructor(
    private subscriptionPaymentMethodService: PaymentMethodOverviewService,
    private authService: AuthService,
  ) { }

  ngAfterViewInit(): void {
    this.getPaymentMethodOverview();
  }

  getPaymentMethodOverview(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        const observable = this.subscriptionPaymentMethodService.getPaymentMethodOverview().subscribe(
          (subscriptionPaymentMethodReply: PaymentMethodOverviewReply) => {
            this.subscriptionPaymentMethodReply = subscriptionPaymentMethodReply;
          });
      }
    });
  }

  getPaymentMethod(): string {
    return this.getBrand() + ' ' + this.getLast4() + ' ' + this.getExpiration();
  }

  getBrand(): string {
    let brand = '';
    if (this.subscriptionPaymentMethodReply) {
      brand = this.subscriptionPaymentMethodReply.brand;
      brand = brand[0].toUpperCase() + brand.slice(1).toLowerCase();
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
