import { Component, ChangeDetectionStrategy, inject, viewChild, input, computed } from '@angular/core';
import { Router } from '@angular/router';
import { NextcloudProduct } from '../nextcloud-page/nextcloud-product';
import { SynologyProduct } from '../synology-page/synology-product';
import { Quantity } from './quantity/quantity';
import { MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

type SubscriptionProduct = NextcloudProduct | SynologyProduct;

@Component({
    selector: 'app-subscription-card',
    templateUrl: './subscription-card.html',
    styleUrls: ['./subscription-card.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatLabel, Quantity, MatCardSubtitle, MatCardActions, MatButton, CurrencyPipe]
})
export class SubscriptionCard {
  private readonly router = inject(Router);

  readonly nextcloudProduct = input<NextcloudProduct | undefined>(undefined);
  readonly synologyProduct = input<SynologyProduct | undefined>(undefined);

  readonly quantityComponent = viewChild(Quantity);

  /**
   * Whichever product was actually bound. Nextcloud takes priority if,
   * for some reason, both were ever passed at once.
   *
   * Deriving this once with `computed()` means every getter below reads
   * from a single source of truth instead of repeating the same
   * "is nextcloud set, else is synology set" branch — which is exactly
   * where the old `this.nextcloudProduct != undefined` bug lived (that
   * checked the signal *function*, not its value).
   */
  readonly product = computed<SubscriptionProduct | undefined>(
    () => this.nextcloudProduct() ?? this.synologyProduct()
  );

  /**
   * Reads the child's `quantity` signal — not its `getQuantity()` method.
   * `computed()` only re-runs when a *signal* it read changes; `getQuantity()`
   * just returns `quantityControl.value`, a plain (non-signal) FormControl
   * value, so depending on it here would silently go stale.
   */
  readonly quantity = computed(() => this.quantityComponent()?.quantity() ?? 1);

  readonly name = computed(() => this.product()?.name ?? '');
  readonly productID = computed(() => this.product()?.productID ?? '');
  readonly storageAmount = computed(() => this.product()?.storageAmount ?? 0);
  readonly storageUnit = computed(() => this.product()?.storageUnit ?? '');
  readonly trialDays = computed(() => this.product()?.trialDays ?? 0);
  readonly isTrialIncluded = computed(() => this.quantity() < 2);

  readonly pricePerMonth = computed(() => {
    const price = this.product()?.pricePerMonth ?? 0;
    return price > 0 ? price / 100 : 0;
  });

  openCheckoutIntegration(): void {
    this.router.navigate(['/checkout'], {
      queryParams: {
        productID: this.productID(),
        quantity: this.quantity(),
      }
    });
  }
}