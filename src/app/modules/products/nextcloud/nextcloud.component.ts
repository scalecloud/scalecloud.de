import { Component, OnInit } from '@angular/core';
import { NextcloudProduct } from './nextcloud-product';
import { ProductType } from '../product-model';
import { ProductService } from '../product/product.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
    selector: 'app-nextcloud',
    templateUrl: './nextcloud.component.html',
    styleUrls: ['./nextcloud.component.scss'],
    standalone: false
})
export class NextcloudComponent implements OnInit {

  productType = ProductType.Nextcloud;
  nextcloudProducts: NextcloudProduct[] = [];
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  constructor(
    private productService: ProductService,
    private snackBarService: SnackBarService,
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
