import { Component, OnInit } from '@angular/core';
import { NextcloudProduct } from './nextcloud-product';
import { ProductTiersRequest, ProductType } from '../product-model';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-nextcloud',
  templateUrl: './nextcloud.component.html',
  styleUrls: ['./nextcloud.component.scss']
})
export class NextcloudComponent implements OnInit {

  productType = ProductType.Nextcloud;
  nextcloudProducts: NextcloudProduct[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getNextcloudProducts();
  }

  getNextcloudProducts(): void {
    const request: ProductTiersRequest = {
      productType: this.productType
    };
    this.productService.getProductTiers(request).subscribe(
      reply => this.nextcloudProducts = reply.productTiers);
  }

}
