import { Component, OnInit } from '@angular/core';
import { NextcloudProduct } from './nextcloud-product';
import { SubscriptionType } from '../SubscriptionType';
import { NextcloudProductService } from './nextcloud-product.service';

@Component({
  selector: 'app-nextcloud',
  templateUrl: './nextcloud.component.html',
  styleUrls: ['./nextcloud.component.scss']
})
export class NextcloudComponent implements OnInit {

  subscriptionType = SubscriptionType.Nextcloud;
  nextcloudProducts: NextcloudProduct[] = [];

  constructor(private nextcloudProductService: NextcloudProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.nextcloudProductService.getNextcloudProducts().subscribe(
      products => this.nextcloudProducts = this.nextcloudProducts);
  }

}
