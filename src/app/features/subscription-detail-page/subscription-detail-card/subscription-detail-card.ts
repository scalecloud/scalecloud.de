import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { SubscriptionDetailReply } from './subscription-detail-card-model';
import { ActivatedRoute } from '@angular/router';
import { ServiceStatus } from 'src/app/shared/client-status';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CancelState } from '../cancel-state/cancel-state';
import { LoadingFailed } from '../../../shared/loading-failed/loading-failed';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';
import { SubscriptionDetailCardClient } from './subscription-detail-card-client';

@Component({
    selector: 'app-subscription-detail-card',
    templateUrl: './subscription-detail-card.html',
    styleUrls: ['./subscription-detail-card.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatCardSubtitle, MatDivider, MatCardContent, MatList, MatListItem, MatTooltip, MatIcon, CancelState, LoadingFailed, CurrencyPipe, DatePipe]
})
export class SubscriptionDetailCard implements OnInit {
  private readonly auth = inject(Auth);
  private readonly permissionStore = inject(PermissionStore);
  private readonly subscriptionDetailCardClient = inject(SubscriptionDetailCardClient);
  private readonly route = inject(ActivatedRoute);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);


  reply: SubscriptionDetailReply | undefined;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  ngOnInit(): void {
    this.checkPermissions();
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }

  async checkPermissions() {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.log.error('SeatsComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    try {
      const hasPermission = await this.permissionStore.isUser(subscriptionID);
      if (hasPermission) {
        this.reloadSubscriptionDetail();
      } else {
        this.serviceStatus = ServiceStatus.NoPermission;
      }
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.snackBar.error('An error occurred while checking permissions.');
      this.log.error('SeatsComponent.checkPermissions: error checking permissions', error);
    }
  }

  reloadSubscriptionDetail(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.auth.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (subscriptionID == null) {
        this.log.error('SubscriptionDetailComponent.getSubscriptionDetail: id is null');
      } else {
        this.subscriptionDetailCardClient.getSubscriptionDetail(subscriptionID)
          .subscribe({
            next: subscriptionDetail => {
              this.reply = subscriptionDetail;
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.serviceStatus = ServiceStatus.Error;
              this.log.error('SubscriptionDetailComponent.getSubscriptionDetail: error fetching subscription detail', error);
            }
          });
      }
    }).catch((error) => {
      this.log.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }

  getID(): string {
    return this.reply?.id || '';
  }

  isActive(): boolean {
    return this.reply?.active || false;
  }

  getProductName(): string {
    return this.reply?.product_name || '';
  }

  getProductType(): string {
    return this.reply?.product_type || '';
  }

  getStorageAmount(): number {
    return this.reply?.storage_amount || 0;
  }

  getTotalStorageAmount(): number {
    return this.getStorageAmount() * this.getUserCount();
  }

  getUserCount(): number {
    return this.reply?.user_count || 0;
  }

  getPricePerMonth(): number {
    return this.reply?.price_per_month || 0;
  }

  getTotalPricePerMonth(): number {
    return this.getPricePerMonth() * this.getUserCount();
  }

  getCurrency(): string {
    return this.reply?.currency.toUpperCase() || '';
  }

  isTrailing(): boolean {
    let trailing = false;
    if (this.reply?.status) {
      trailing = this.reply?.status === 'trialing';
    }
    return trailing;
  }

  getTrailingEnd(): number {
    return this.reply?.trial_end || 0;
  }

  isCancelAtPeriodEnd(): boolean {
    return this.reply?.cancel_at_period_end || false;
  }

  getCancelAt(): number {
    return this.reply?.cancel_at || 0;
  }

  getCurrentPeriodEnd(): number {
    return this.reply?.current_period_end || 0;
  }

}
