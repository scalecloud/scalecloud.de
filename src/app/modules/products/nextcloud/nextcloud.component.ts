import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NextcloudProduct } from './nextcloud-product';
import { ProductType } from '../product-model';
import { ProductService } from '../product/product.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { TitelCardComponent } from '../titel-card/titel-card.component';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { LoadingFailedComponent } from '../../../shared/components/loading-failed/loading-failed.component';

@Component({
    selector: 'app-nextcloud',
    templateUrl: './nextcloud.component.html',
    styleUrls: ['./nextcloud.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TitelCardComponent, MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatDivider, MatCardContent, MatList, MatListItem, SubscriptionCardComponent, LoadingFailedComponent]
})
export class NextcloudComponent implements OnInit {

  productType = ProductType.Nextcloud;
  nextcloudProducts: NextcloudProduct[] = [];
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  constructor(
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getNextcloudProducts();
  }

  getNextcloudProducts(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.productService.getProductTiers(this.productType)
      .subscribe({
        next: reply => {
          this.nextcloudProducts = reply.productTiers;
          this.serviceStatus = ServiceStatus.Success;
        },
        error: error => {
          this.serviceStatus = ServiceStatus.Error;
        }
      });
  }

}
