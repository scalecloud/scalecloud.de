import { Component, OnInit } from '@angular/core';
import { SynologyProduct } from './synology-product';
import { ProductType } from '../product-model';
import { ProductService } from '../product/product.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-synology',
  templateUrl: './synology.component.html',
  styleUrls: ['./synology.component.scss']
})
export class SynologyComponent implements OnInit {

  productType = ProductType.Synology;
  synologyProducts: SynologyProduct[] = [];
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  constructor(
    private productService: ProductService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.getSynologyProducts();
  }

  getSynologyProducts(): void {
    this.serviceStatus = ServiceStatus.Loading;

    this.productService.getProductTiers(this.productType)
      .subscribe({
        next: reply => {
          this.synologyProducts = reply.productTiers;
          this.serviceStatus = ServiceStatus.Success;
        },
        error: error => {
          this.serviceStatus = ServiceStatus.Error;
          this.snackBarService.error('Could not get subscriptions. Please try again later.');
        }
      });

    this.productService.getProductTiers(this.productType).subscribe(
      reply => this.synologyProducts = reply.productTiers);
  }

}
