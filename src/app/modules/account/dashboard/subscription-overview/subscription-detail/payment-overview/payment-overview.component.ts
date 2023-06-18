import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SubscriptionPaymentMethodReply, SubscriptionPaymentMethodRequest } from './subscription-payment-method';
import { SubscriptionPaymentMethodService } from './subscription-payment-method.service';
import { ActivatedRoute } from '@angular/router';

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
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.getSubscriptionPaymentMethod();
  }

  getSubscriptionPaymentMethod(): void {
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
            let subscriptionPaymentMethodRequest: SubscriptionPaymentMethodRequest = {
              id: id
            }
            const observable = this.subscriptionPaymentMethodService.getSubscriptionPaymentMethod(subscriptionPaymentMethodRequest).subscribe(
              (subscriptionPaymentMethodReply: SubscriptionPaymentMethodReply) => {
                this.subscriptionPaymentMethodReply = subscriptionPaymentMethodReply;
              });
          }
        }
      }
    });
  }

  getID(): string {
    let id = '';
    const idRoute = this.route.snapshot.paramMap.get('id');
    if (idRoute == null) {
      this.logService.error('SubscriptionPaymentMethodComponent.getID: id is null');
    } else {  
      id = idRoute;
    }
    return id;
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
