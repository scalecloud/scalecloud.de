import { Component, Input, ChangeDetectionStrategy, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NextcloudProduct } from '../nextcloud/nextcloud-product';
import { SynologyProduct } from '../synology/synology-product';
import { QuantityComponent } from './quantity/quantity.component';
import { MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardActions } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-subscription-card',
    templateUrl: './subscription-card.component.html',
    styleUrls: ['./subscription-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatDivider, MatCardContent, MatList, MatListItem, MatIcon, MatLabel, QuantityComponent, MatCardSubtitle, MatCardActions, MatButton, CurrencyPipe]
})
export class SubscriptionCardComponent {
  private readonly router = inject(Router);


  @Input() nextcloudProduct: NextcloudProduct | undefined;
  @Input() synologyProduct: SynologyProduct | undefined;

  readonly quantityComponent = viewChild(QuantityComponent);

  openCheckoutIntegration(): void {
    const productID = this.getProductID();
    const quantity = this.getQuantity();
    this.router.navigate(['/checkout'],
      {
        queryParams: {
          productID: productID,
          quantity: quantity,
        }
      }
    );
  }

  getQuantity(): number {
    let ret = 1;
    if (this.quantityComponent != undefined) {
      ret = this.quantityComponent().getQuantity();
    }
    return ret;
  }

  getProductID(): string {
    let ret = "";
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.productID;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.productID;
    }
    return ret;
  }

  getName(): string {
    let ret = "";
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.name;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.name;
    }
    return ret;
  }

  getStorageAmount(): number {
    let ret = 0;
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.storageAmount;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.storageAmount;
    }
    return ret;
  }

  getStorageUnit(): string {
    let ret = "";
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.storageUnit;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.storageUnit;
    }
    return ret;
  }

  getIsTrialIncluded(): boolean {
    return this.getQuantity() < 2;
  }

  getTrialDays(): number {
    let ret = 0;
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.trialDays;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.trialDays;
    }
    return ret;
  }

  getPricePerMonth(): number {
    let ret = 0;
    if (this.nextcloudProduct != undefined) {
      ret = this.nextcloudProduct.pricePerMonth;
    } else if (this.synologyProduct != undefined) {
      ret = this.synologyProduct.pricePerMonth;
    }
    if (ret > 0) {
      ret = ret / 100;
    }
    return ret;
  }
}
