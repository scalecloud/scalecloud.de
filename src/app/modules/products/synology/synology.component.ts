import { Component, OnInit } from '@angular/core';
import { SynologyProduct } from './synology-product';
import { ProductTiersRequest, ProductType } from '../product-model';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-synology',
  templateUrl: './synology.component.html',
  styleUrls: ['./synology.component.scss']
})
export class SynologyComponent implements OnInit {

  productType = ProductType.Synology;
  synologyProducts: SynologyProduct[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getSynologyProducts();
  }

  getSynologyProducts(): void {
    const request: ProductTiersRequest = {
      productType: this.productType
    };
      this.productService.getProductTiers(request).subscribe(
        reply => this.synologyProducts = reply.productTiers);
  }

}
