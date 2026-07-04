import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { NextcloudProduct } from './nextcloud-product';
import { ProductType } from '../product-model';
import { ProductService } from '../product/product.service';
import { ServiceStatus } from 'src/app/shared/service-status';
import { TitleCardComponent } from '../title-card/title-card.component';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { LoadingFailedComponent } from '../../../shared/loading-failed/loading-failed.component';

@Component({
    selector: 'app-nextcloud',
    templateUrl: './nextcloud.component.html',
    styleUrls: ['./nextcloud.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TitleCardComponent, MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatDivider, MatCardContent, MatList, MatListItem, SubscriptionCardComponent, LoadingFailedComponent]
})
export class NextcloudComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly ServiceStatus = ServiceStatus;
  readonly productType = ProductType.Nextcloud;

  // Signals instead of plain fields: under zoneless change detection, mutating a
  // plain property from inside an RxJS subscribe callback gives Angular no signal
  // that the view needs to re-render. Signals make the write itself the trigger.
  readonly nextcloudProducts = signal<NextcloudProduct[]>([]);
  readonly serviceStatus = signal(ServiceStatus.Initializing);

  ngOnInit(): void {
    this.getNextcloudProducts();
  }

  getNextcloudProducts(): void {
    this.serviceStatus.set(ServiceStatus.Loading);
    this.productService.getProductTiers(this.productType)
      .subscribe({
        next: reply => {
          this.nextcloudProducts.set(reply.productTiers);
          this.serviceStatus.set(ServiceStatus.Success);
        },
        error: () => {
          this.serviceStatus.set(ServiceStatus.Error);
        }
      });
  }

}