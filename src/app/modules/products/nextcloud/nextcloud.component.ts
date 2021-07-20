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
    this.getNextcloudProducts();
  }

  getNextcloudProducts(): void {
    if (this.nextcloudProductService != null) {
      this.nextcloudProductService.getNextcloudProducts().subscribe(
        nextcloudProducts => this.nextcloudProducts = nextcloudProducts);
    }
  }

}
