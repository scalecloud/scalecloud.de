import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionDetailReply } from './subscription-detail-card';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { SubscriptionDetailCardServiceService } from './subscription-detail-card-service.service';

@Component({
  selector: 'app-subscription-detail-card',
  templateUrl: './subscription-detail-card.component.html',
  styleUrls: ['./subscription-detail-card.component.scss']
})
export class SubscriptionDetailCardComponent implements OnInit  {

  reply: SubscriptionDetailReply | undefined;

  constructor(
    public authService: AuthService,
    private permissionService: PermissionService,
    private subscriptionDetailCardServiceService: SubscriptionDetailCardServiceService,
    private route: ActivatedRoute,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.reloadSubscriptionDetail();
  }

  reloadSubscriptionDetail(): void {
    this.authService.waitForAuth().then(() => {
      const id = this.route.snapshot.paramMap.get('subscriptionID');
      if (id == null) {
        this.logService.error('SubscriptionDetailComponent.getSubscriptionDetail: id is null');
      } else {
        this.subscriptionDetailCardServiceService.getSubscriptionDetail(id)
          .subscribe(subscriptionDetail => this.reply = subscriptionDetail);
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
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

}
