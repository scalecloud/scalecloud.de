import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { PaymentMethodOverviewService } from './payment-method-overview.service';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.scss']
})
export class PaymentOverviewComponent {

  paymentMethodOverviewReply: PaymentMethodOverviewReply | undefined;

  constructor(
    private subscriptionPaymentMethodService: PaymentMethodOverviewService,
    private authService: AuthService,
    private logService: LogService,
    private returnUrlService: ReturnUrlService,
  ) { }

  async initPaymentMethodOverview(): Promise<boolean> {
    try {
      await this.authService.waitForAuth();
      const subscriptionPaymentMethodReply = await firstValueFrom(this.subscriptionPaymentMethodService.getPaymentMethodOverview());
      this.paymentMethodOverviewReply = subscriptionPaymentMethodReply;
      return this.hasPaymentMethod();
    } catch (error) {
      this.logService.error("Error: " + error);
      return false;
    }
  }

  openUrlChangePaymentMethod(): void {
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/change-payment');
  }

  hasPaymentMethod(): boolean {
    return this.paymentMethodOverviewReply && this.paymentMethodOverviewReply.has_valid_payment_method;
  }

  getPaymentMethod(): string {
    let paymentMethodOverview = '';
    if (this.paymentMethodOverviewReply) {
      if (this.paymentMethodOverviewReply.type === 'card') {
        paymentMethodOverview = this.getPaymentMethodCard();
      }
      else if (this.paymentMethodOverviewReply.type === 'sepa_debit') {
        paymentMethodOverview = this.getPaymentMethodSEPADebit();
      }
      else if (this.paymentMethodOverviewReply.type === 'paypal') {
        paymentMethodOverview = this.getPayPalEMail();
      }
    }
    return paymentMethodOverview;
  }

  isCreditCard(): boolean {
    let isCreditCard = false;
    if (this.paymentMethodOverviewReply) {
      if (this.paymentMethodOverviewReply.type === 'card') {
        isCreditCard = true;
      }
    }
    return isCreditCard;
  }

  isSEPA(): boolean {
    let isSepa = false;
    if (this.paymentMethodOverviewReply) {
      if (this.paymentMethodOverviewReply.type === 'sepa_debit') {
        isSepa = true;
      }
    }
    return isSepa;
  }

  isPayPal(): boolean {
    let isPayPal = false;
    if (this.paymentMethodOverviewReply) {
      if (this.paymentMethodOverviewReply.type === 'paypal') {
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
    if (this.paymentMethodOverviewReply?.card?.brand === 'amex') {
      isAmericanExpress = true;
    }
    return isAmericanExpress;
  }

  isDinersClub(): boolean {
    let isDinersClub = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'diners') {
      isDinersClub = true;
    }
    return isDinersClub;
  }

  isDiscover(): boolean {
    let isDiscover = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'discover') {
      isDiscover = true;
    }
    return isDiscover;
  }

  isEFTPOS(): boolean {
    let isEFTPOS = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'eftpos_au') {
      isEFTPOS = true;
    }
    return isEFTPOS;
  }

  isJCB(): boolean {
    let isJCB = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'jcb') {
      isJCB = true;
    }
    return isJCB;
  }

  isMasterCard(): boolean {
    let isMastercard = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'mastercard') {
      isMastercard = true;
    }
    return isMastercard;
  }

  isUnionPay(): boolean {
    let isUnionPay = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'unionpay') {
      isUnionPay = true;
    }
    return isUnionPay;
  }

  isVisa(): boolean {
    let isVisa = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'visa') {
      isVisa = true;
    }
    return isVisa;
  }

  isUnknownCreditCard(): boolean {
    let isUnknownCreditCard = false;
    if (this.paymentMethodOverviewReply?.card?.brand === 'unknown') {
      isUnknownCreditCard = true;
    }
    return isUnknownCreditCard;
  }

  getCardBrand(): string {
    let brand = '';
    if (this.paymentMethodOverviewReply.card.brand) {
      brand = this.paymentMethodOverviewReply.card.brand;
      brand = brand[0].toUpperCase() + brand.slice(1).toLowerCase();
    }
    return brand;
  }

  getCardLast4(): string {
    let last4 = '';
    if (this.paymentMethodOverviewReply) {
      last4 = this.paymentMethodOverviewReply.card.last4;
    }
    return last4;
  }

  getCardExpiration(): string {
    let expiration = '';
    if (this.paymentMethodOverviewReply) {
      expiration = ' ' + this.paymentMethodOverviewReply.card.exp_month + '/' + this.paymentMethodOverviewReply.card.exp_year;
    }
    return expiration;
  }

  getPaymentMethodSEPADebit(): string {
    return this.getSEPADebitCountry() + '** **** **** **** **' + this.getSEPADebitLast4();
  }

  getSEPADebitCountry(): string {
    let country = '';
    if (this.paymentMethodOverviewReply) {
      country = this.paymentMethodOverviewReply.sepa_debit.country;
    }
    return country;
  }

  getSEPADebitLast4(): string {
    let last4 = '';
    if (this.paymentMethodOverviewReply && this.paymentMethodOverviewReply.sepa_debit.last4.length === 4) {
      let first2 = this.paymentMethodOverviewReply.sepa_debit.last4.slice(0, 2);
      let last2 = this.paymentMethodOverviewReply.sepa_debit.last4.slice(2, 4);
      last4 = first2 + ' ' + last2;
    }
    return last4;
  }

  getPayPalEMail(): string {
    let email = '';
    if (this.paymentMethodOverviewReply) {
      email = this.paymentMethodOverviewReply.paypal.email;
    }
    return email;
  }

}
