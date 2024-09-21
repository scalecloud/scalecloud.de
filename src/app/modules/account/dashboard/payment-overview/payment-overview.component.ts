import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { PaymentMethodOverviewService } from './payment-method-overview.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.scss']
})
export class PaymentOverviewComponent implements OnInit {
  reply: PaymentMethodOverviewReply | undefined;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  constructor(
    private subscriptionPaymentMethodService: PaymentMethodOverviewService,
    private authService: AuthService,
    private logService: LogService,
    private returnUrlService: ReturnUrlService,
  ) { }

  ngOnInit(): void {
    this.initPaymentMethodOverview();
  }

  initPaymentMethodOverview(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      this.subscriptionPaymentMethodService.getPaymentMethodOverview()
        .subscribe({
          next: paymentMethodOverviewReply => {
            this.reply = paymentMethodOverviewReply;
            this.serviceStatus = ServiceStatus.Success;
          },
          error: error => {
            this.serviceStatus = ServiceStatus.Error;
          }
        });
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }

  openUrlChangePaymentMethod(): void {
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/change-payment');
  }

  hasPaymentMethod(): boolean {
    return this.reply?.has_valid_payment_method;
  }

  getPaymentMethod(): string {
    let paymentMethodOverview = '';
    if (this.reply) {
      if (this.reply.type === 'card') {
        paymentMethodOverview = this.getPaymentMethodCard();
      }
      else if (this.reply.type === 'sepa_debit') {
        paymentMethodOverview = this.getPaymentMethodSEPADebit();
      }
      else if (this.reply.type === 'paypal') {
        paymentMethodOverview = this.getPayPalEMail();
      }
    }
    return paymentMethodOverview;
  }

  isCreditCard(): boolean {
    let isCreditCard = false;
    if (this.reply) {
      if (this.reply.type === 'card') {
        isCreditCard = true;
      }
    }
    return isCreditCard;
  }

  isSEPA(): boolean {
    let isSepa = false;
    if (this.reply) {
      if (this.reply.type === 'sepa_debit') {
        isSepa = true;
      }
    }
    return isSepa;
  }

  isPayPal(): boolean {
    let isPayPal = false;
    if (this.reply) {
      if (this.reply.type === 'paypal') {
        isPayPal = true;
      }
    }
    return isPayPal;
  }

  getPaymentMethodCard(): string {
    return '**** **** **** ' + this.getCardLast4() + ' - ' + this.getCardExpiration();
  }

  isAmericanExpress(): boolean {
    let isAmericanExpress = false;
    if (this.reply?.card?.brand === 'amex') {
      isAmericanExpress = true;
    }
    return isAmericanExpress;
  }

  isDinersClub(): boolean {
    let isDinersClub = false;
    if (this.reply?.card?.brand === 'diners') {
      isDinersClub = true;
    }
    return isDinersClub;
  }

  isDiscover(): boolean {
    let isDiscover = false;
    if (this.reply?.card?.brand === 'discover') {
      isDiscover = true;
    }
    return isDiscover;
  }

  isEFTPOS(): boolean {
    let isEFTPOS = false;
    if (this.reply?.card?.brand === 'eftpos_au') {
      isEFTPOS = true;
    }
    return isEFTPOS;
  }

  isJCB(): boolean {
    let isJCB = false;
    if (this.reply?.card?.brand === 'jcb') {
      isJCB = true;
    }
    return isJCB;
  }

  isMasterCard(): boolean {
    let isMastercard = false;
    if (this.reply?.card?.brand === 'mastercard') {
      isMastercard = true;
    }
    return isMastercard;
  }

  isUnionPay(): boolean {
    let isUnionPay = false;
    if (this.reply?.card?.brand === 'unionpay') {
      isUnionPay = true;
    }
    return isUnionPay;
  }

  isVisa(): boolean {
    let isVisa = false;
    if (this.reply?.card?.brand === 'visa') {
      isVisa = true;
    }
    return isVisa;
  }

  isUnknownCreditCard(): boolean {
    let isUnknownCreditCard = false;
    if (this.reply?.card?.brand === 'unknown') {
      isUnknownCreditCard = true;
    }
    return isUnknownCreditCard;
  }

  getCardBrand(): string {
    let brand = '';
    if (this.reply.card.brand) {
      brand = this.reply.card.brand;
      brand = brand[0].toUpperCase() + brand.slice(1).toLowerCase();
    }
    return brand;
  }

  getCardLast4(): string {
    let last4 = '';
    if (this.reply) {
      last4 = this.reply.card.last4;
    }
    return last4;
  }

  getCardExpiration(): string {
    let expiration = '';
    if (this.reply) {
      expiration = ' ' + this.reply.card.exp_month + '/' + this.reply.card.exp_year;
    }
    return expiration;
  }

  getPaymentMethodSEPADebit(): string {
    return this.getSEPADebitCountry() + '** **** **** **** **' + this.getSEPADebitLast4();
  }

  getSEPADebitCountry(): string {
    let country = '';
    if (this.reply) {
      country = this.reply.sepa_debit.country;
    }
    return country;
  }

  getSEPADebitLast4(): string {
    let last4 = '';
    if (this.reply && this.reply.sepa_debit.last4.length === 4) {
      let first2 = this.reply.sepa_debit.last4.slice(0, 2);
      let last2 = this.reply.sepa_debit.last4.slice(2, 4);
      last4 = first2 + ' ' + last2;
    }
    return last4;
  }

  getPayPalEMail(): string {
    let email = '';
    if (this.reply) {
      email = this.reply.paypal.email;
    }
    return email;
  }

}
