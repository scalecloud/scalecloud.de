import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { SynologyProduct } from './synology-product';
import { ProductType } from '../product-model';
import { ProductClient } from '../product-client/product-client';
import { ServiceStatus } from 'src/app/shared/service-status';
import { TitleCard } from '../title-card/title-card';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { SubscriptionCard } from '../subscription-card/subscription-card';
import { LoadingFailedComponent } from '../../../shared/loading-failed/loading-failed.component';

@Component({
    selector: 'app-synology-page',
    templateUrl: './synology-page.html',
    styleUrls: ['./synology-page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TitleCard, MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatDivider, MatCardContent, MatList, MatListItem, SubscriptionCard, LoadingFailedComponent]
})
export class SynologyPage implements OnInit {
  private readonly productService = inject(ProductClient);

  readonly ServiceStatus = ServiceStatus;
  readonly productType = ProductType.Synology;

  // Signals instead of plain fields: under zoneless change detection, mutating a
  // plain property from inside an RxJS subscribe callback gives Angular no signal
  // that the view needs to re-render. Signals make the write itself the trigger.
  readonly synologyProducts = signal<SynologyProduct[]>([]);
  readonly serviceStatus = signal(ServiceStatus.Initializing);

  ngOnInit(): void {
    this.getSynologyProducts();
  }

  getSynologyProducts(): void {
    this.serviceStatus.set(ServiceStatus.Loading);
    this.productService.getProductTiers(this.productType)
      .subscribe({
        next: reply => {
          this.synologyProducts.set(reply.productTiers);
          this.serviceStatus.set(ServiceStatus.Success);
        },
        error: () => {
          this.serviceStatus.set(ServiceStatus.Error);
        }
      });
  }

}