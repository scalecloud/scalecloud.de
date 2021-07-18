import { Component, OnInit } from '@angular/core';
import { SynologyProduct } from './synology-product';
import { SynologyProductService } from './synology-product.service';
import { SubscriptionType } from '../SubscriptionType';

@Component({
  selector: 'app-synology',
  templateUrl: './synology.component.html',
  styleUrls: ['./synology.component.scss']
})
export class SynologyComponent implements OnInit {

  subscriptionType = SubscriptionType.Synology;
  synologyProducts: SynologyProduct[] = [];

  constructor(private synologyProductService: SynologyProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.synologyProductService.getProducts().subscribe(
      products => this.synologyProducts = this.synologyProducts);
  }

}
