import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { SubscriptionDetailReply } from './subscription-detail-card';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/core/logging/log.service';
import { PermissionService } from 'src/app/core/permission/permission.service';
import { SubscriptionDetailCardService } from './subscription-detail-card-service';
import { ServiceStatus } from 'src/app/shared/service-status';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CancelStateComponent } from '../cancel-state/cancel-state.component';
import { LoadingFailedComponent } from '../../../../../shared/loading-failed/loading-failed.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-subscription-detail-card',
    templateUrl: './subscription-detail-card.component.html',
    styleUrls: ['./subscription-detail-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatCardSubtitle, MatDivider, MatCardContent, MatList, MatListItem, MatTooltip, MatIcon, CancelStateComponent, LoadingFailedComponent, CurrencyPipe, DatePipe]
})
export class SubscriptionDetailCardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly permissionService = inject(PermissionService);
  private readonly subscriptionDetailCardService = inject(SubscriptionDetailCardService);
  private readonly route = inject(ActivatedRoute);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);


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
      this.logService.error('SeatsComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    try {
      const hasPermission = await this.permissionService.isUser(subscriptionID);
      if (hasPermission) {
        this.reloadSubscriptionDetail();
      } else {
        this.serviceStatus = ServiceStatus.NoPermission;
      }
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.snackBarService.error('An error occurred while checking permissions.');
      this.logService.error('SeatsComponent.checkPermissions: error checking permissions', error);
    }
  }

  reloadSubscriptionDetail(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (subscriptionID == null) {
        this.logService.error('SubscriptionDetailComponent.getSubscriptionDetail: id is null');
      } else {
        this.subscriptionDetailCardService.getSubscriptionDetail(subscriptionID)
          .subscribe({
            next: subscriptionDetail => {
              this.reply = subscriptionDetail;
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.serviceStatus = ServiceStatus.Error;
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
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
