import { Component, ChangeDetectionStrategy, inject, viewChild, output, computed, resource, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { QuantityComponent } from '../../subscription-card/quantity/quantity.component';
import { CheckoutProductRequest } from './checkout-product';
import { CheckoutProductService } from './checkout-product.service';
import { CurrencyPipe } from '@angular/common';
import { CheckoutCreateSubscriptionRequest } from '../checkout-create-subscription';
import { ActivatedRoute } from '@angular/router';
import { ServiceStatus } from 'src/app/shared/service-status';
import { MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../../../shared/loading-failed/loading-failed.component';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';

@Component({
    selector: 'app-checkout-details',
    templateUrl: './checkout-details.component.html',
    styleUrls: ['./checkout-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatLabel, QuantityComponent, MatCardSubtitle, MatCardActions, MatButton, LoadingFailedComponent, CurrencyPipe]
})
export class CheckoutDetailsComponent {
  private readonly log = inject(Log);
  private readonly checkoutProductService = inject(CheckoutProductService);
  private readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);

  readonly quantityComponent = viewChild(QuantityComponent);
  readonly startSubscriptionEvent = output<CheckoutCreateSubscriptionRequest>();

  readonly ServiceStatus = ServiceStatus;

  // Reactive view of the query params. toSignal() needs an initial value
  // since the Observable may not emit synchronously on every navigation.
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly productID = computed<string | undefined>(() => this.queryParamMap().get('productID') ?? undefined);

  // resource() replaces the old ngOnInit + waitForAuth().then(...).subscribe(...) chain.
  // It re-runs the loader automatically whenever productID changes, and exposes
  // loading/error/value as signals instead of fields we had to mutate by hand.
  // When productID is undefined the loader is skipped entirely and the resource
  // status becomes 'idle' (handled below in `serviceStatus`).
  private readonly checkoutProductResource = resource({
    params: (): CheckoutProductRequest | undefined => {
      const productID = this.productID();
      return productID ? { productID } : undefined;
    },
    loader: async ({ params }) => {
      await this.auth.waitForAuth();
      return firstValueFrom(this.checkoutProductService.getCheckoutProduct(params));
    },
  });

  readonly reply = this.checkoutProductResource.value;

  readonly serviceStatus = computed<ServiceStatus>(() => {
    // A missing productID is a hard error - previously this left the component
    // stuck on ServiceStatus.Loading forever since nothing ever set it to Error.
    if (!this.productID()) {
      return ServiceStatus.Error;
    }
    switch (this.checkoutProductResource.status()) {
      case 'loading':
      case 'reloading':
        return ServiceStatus.Loading;
      case 'resolved':
      case 'local':
        return ServiceStatus.Success;
      case 'error':
        return ServiceStatus.Error;
      default:
        return ServiceStatus.Initializing;
    }
  });

  readonly quantity = computed(() => this.quantityComponent()?.getQuantity() ?? 0);

  readonly name = computed(() => this.reply()?.name ?? '');
  readonly currency = computed(() => this.reply()?.currency ?? '');
  readonly storageAmount = computed(() => (this.reply()?.storageAmount ?? 0) * this.quantity());
  readonly storageUnit = computed(() => this.reply()?.storageUnit ?? '');
  readonly trialDays = computed(() => Math.max(this.reply()?.trialDays ?? 0, 0));
  readonly isTrialIncluded = computed(() => this.quantity() < 2 && this.trialDays() > 0);
  readonly hasPaymentMethod = computed(() => this.reply()?.has_valid_payment_method ?? false);

  // Raw numeric price; the `currency` pipe in the template handles formatting,
  // so we no longer need to inject CurrencyPipe and call .transform() by hand.
  readonly rawPricePerMonth = computed(() => {
    const reply = this.reply();
    if (!reply || reply.pricePerMonth <= 0) {
      return 0;
    }
    return (reply.pricePerMonth / 100) * this.quantity();
  });

  constructor() {
    effect(() => {
      if (this.productID() === undefined) {
        this.log.error('Could not determine productID from the query params.');
      }
    });
  }

  startSubscription(): void {
    const productID = this.reply()?.productID;
    if (!productID) {
      this.log.error('Cannot start subscription without a loaded product.');
      return;
    }
    this.startSubscriptionEvent.emit({
      productID,
      quantity: this.quantity(),
    });
  }

}