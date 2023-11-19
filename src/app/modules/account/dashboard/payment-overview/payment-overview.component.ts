import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { PaymentMethodOverviewService } from './payment-method-overview.service';

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
    let paymentMethodOverview = '';
    if (this.subscriptionPaymentMethodReply) {
      if (this.subscriptionPaymentMethodReply.type === 'card') {
        paymentMethodOverview = this.getPaymentMethodCard();
      }
      else if (this.subscriptionPaymentMethodReply.type === 'sepa_debit') {
        paymentMethodOverview = this.getPaymentMethodSEPADebit();
      }
      else if (this.subscriptionPaymentMethodReply.type === 'paypal') {
        paymentMethodOverview = this.getPayPalEMail();
      }
    }
    return paymentMethodOverview;
  }

  isCreditCard(): boolean {
    let isCreditCard = false;
    if (this.subscriptionPaymentMethodReply) {
      if (this.subscriptionPaymentMethodReply.type === 'card') {
        isCreditCard = true;
      }
    }
    return isCreditCard;
  }

  isSEPA(): boolean {
    let isSepa = false;
    if (this.subscriptionPaymentMethodReply) {
      if (this.subscriptionPaymentMethodReply.type === 'sepa_debit') {
        isSepa = true;
      }
    }
    return isSepa;
  }

  isPayPal(): boolean {
    let isPayPal = false;
    if (this.subscriptionPaymentMethodReply) {
      if (this.subscriptionPaymentMethodReply.type === 'paypal') {
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
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'amex') {
        isAmericanExpress = true;
      }
    }
    return isAmericanExpress;
  }

  isDinersClub(): boolean {
    let isDinersClub = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'diners') {
        isDinersClub = true;
      }
    }
    return isDinersClub;
  }

  isDiscover(): boolean {
    let isDiscover = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'discover') {
        isDiscover = true;
      }
    }
    return isDiscover;
  }

  isEFTPOS(): boolean {
    let isEFTPOS = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'eftpos_au') {
        isEFTPOS = true;
      }
    }
    return isEFTPOS;
  }

  isJCB(): boolean {
    let isJCB = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'jcb') {
        isJCB = true;
      }
    }
    return isJCB;
  }

  isMasterCard(): boolean {
    let isMastercard = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'mastercard') {
        isMastercard = true;
      }
    }
    return isMastercard;
  }

  isUnionPay(): boolean {
    let isUnionPay = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'unionpay') {
        isUnionPay = true;
      }
    }
    return isUnionPay;
  }

  isVisa(): boolean {
    let isVisa = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'visa') {
        isVisa = true;
      }
    }
    return isVisa;
  }

  isUnknownCreditCard(): boolean {
    let isUnknownCreditCard = false;
    if (this.subscriptionPaymentMethodReply?.card?.brand) {
      if (this.subscriptionPaymentMethodReply.card.brand === 'unknown') {
        isUnknownCreditCard = true;
      }
    }
    return isUnknownCreditCard;
  }

  getCardBrand(): string {
    let brand = '';
    if (this.subscriptionPaymentMethodReply.card.brand) {
      brand = this.subscriptionPaymentMethodReply.card.brand;
      brand = brand[0].toUpperCase() + brand.slice(1).toLowerCase();
    }
    return brand;
  }

  getCardLast4(): string {
    let last4 = '';
    if (this.subscriptionPaymentMethodReply) {
      last4 = this.subscriptionPaymentMethodReply.card.last4;
    }
    return last4;
  }

  getCardExpiration(): string {
    let expiration = '';
    if (this.subscriptionPaymentMethodReply) {
      expiration = ' ' + this.subscriptionPaymentMethodReply.card.exp_month + '/' + this.subscriptionPaymentMethodReply.card.exp_year;
    }
    return expiration;
  }

  getPaymentMethodSEPADebit(): string {
    return this.getSEPADebitCountry() + '** **** **** **** **' + this.getSEPADebitLast4();
  }

  getSEPADebitCountry(): string {
    let country = '';
    if (this.subscriptionPaymentMethodReply) {
      country = this.subscriptionPaymentMethodReply.sepa_debit.country;
    }
    return country;
  }

  getSEPADebitLast4(): string {
    let last4 = '';
    if (this.subscriptionPaymentMethodReply && this.subscriptionPaymentMethodReply.sepa_debit.last4.length === 4) {
      let first2 = this.subscriptionPaymentMethodReply.sepa_debit.last4.slice(0, 2);
      let last2 = this.subscriptionPaymentMethodReply.sepa_debit.last4.slice(2, 4);
      last4 = first2 + ' ' + last2;
    }
    return last4;
  }

  getPayPalEMail(): string {
    let email = '';
    if (this.subscriptionPaymentMethodReply) {
      email = this.subscriptionPaymentMethodReply.paypal.email;
    }
    return email;
  }

}
