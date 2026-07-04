import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/core/logging/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { PaymentMethodOverviewReply } from './payment-method-overview';
import { PaymentMethodOverviewService } from './payment-method-overview.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../../../shared/loading-failed/loading-failed.component';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrl: './payment-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatProgressBar,
    MatCardTitle,
    MatDivider,
    MatCardContent,
    MatList,
    MatListItem,
    NgxSkeletonLoaderComponent,
    MatIcon,
    MatCardActions,
    MatButton,
    LoadingFailedComponent,
  ],
})
export class PaymentOverviewComponent implements OnInit {
  private readonly paymentMethodService = inject(PaymentMethodOverviewService);
  private readonly authService = inject(AuthService);
  private readonly logService = inject(LogService);
  private readonly returnUrlService = inject(ReturnUrlService);

  readonly ServiceStatus = ServiceStatus;
  readonly reply = signal<PaymentMethodOverviewReply | null>(null);
  readonly serviceStatus = signal<ServiceStatus>(ServiceStatus.Initializing);

  readonly hasPaymentMethod = computed(() => this.reply()?.has_valid_payment_method ?? false);
  readonly isCreditCard = computed(() => this.reply()?.type === 'card');
  readonly isSEPA = computed(() => this.reply()?.type === 'sepa_debit');
  readonly isPayPal = computed(() => this.reply()?.type === 'paypal');

  readonly cardBrand = computed(() => {
    const brand = this.reply()?.card?.brand ?? '';
    return brand ? brand[0].toUpperCase() + brand.slice(1).toLowerCase() : '';
  });

  readonly isAmericanExpress = computed(() => this.reply()?.card?.brand === 'amex');
  readonly isDinersClub = computed(() => this.reply()?.card?.brand === 'diners');
  readonly isDiscover = computed(() => this.reply()?.card?.brand === 'discover');
  readonly isEFTPOS = computed(() => this.reply()?.card?.brand === 'eftpos_au');
  readonly isJCB = computed(() => this.reply()?.card?.brand === 'jcb');
  readonly isMasterCard = computed(() => this.reply()?.card?.brand === 'mastercard');
  readonly isUnionPay = computed(() => this.reply()?.card?.brand === 'unionpay');
  readonly isVisa = computed(() => this.reply()?.card?.brand === 'visa');
  readonly isUnknownCreditCard = computed(() => this.reply()?.card?.brand === 'unknown');

  readonly paymentMethodDisplay = computed(() => {
    const data = this.reply();
    if (!data) return '';
    switch (data.type) {
      case 'card':     return this.formatCard(data);
      case 'sepa_debit': return this.formatSepaDebit(data);
      case 'paypal':   return data.paypal.email;
      default:         return '';
    }
  });

  ngOnInit(): void {
    this.loadPaymentMethodOverview();
  }

  openUrlChangePaymentMethod(): void {
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/change-payment');
  }

  private loadPaymentMethodOverview(): void {
    this.serviceStatus.set(ServiceStatus.Loading);

    this.authService
      .waitForAuth()
      .then(() => {
        this.paymentMethodService.getPaymentMethodOverview().subscribe({
          next: (data) => {
            this.reply.set(data);
            this.serviceStatus.set(ServiceStatus.Success);
          },
          error: (error) => {
            this.serviceStatus.set(ServiceStatus.Error);
            this.logService.error(`getPaymentMethodOverview failed: ${error}`);
          },
        });
      })
      .catch((error) => {
        this.logService.error(`waitForAuth failed: ${error}`);
        this.serviceStatus.set(ServiceStatus.Error);
      });
  }

  private formatCard(data: PaymentMethodOverviewReply): string {
    const { last4, exp_month, exp_year } = data.card;
    return `**** **** **** ${last4} - ${exp_month}/${exp_year}`;
  }

  private formatSepaDebit(data: PaymentMethodOverviewReply): string {
    const { country, last4 } = data.sepa_debit;
    const formattedLast4 = last4.length === 4
      ? `${last4.slice(0, 2)} ${last4.slice(2, 4)}`
      : last4;
    return `${country}** **** **** **** **${formattedLast4}`;
  }
}