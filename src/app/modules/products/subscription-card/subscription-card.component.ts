import { Component, Input, OnInit } from '@angular/core';
import { NextcloudProduct } from '../nextcloud/nextcloud-product';
import { SynologyProduct } from '../synology/synology-product';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss']
})
export class SubscriptionCardComponent implements OnInit {

  @Input() nextcloudProduct: NextcloudProduct | undefined;
  @Input() synologyProduct: SynologyProduct | undefined;

  ngOnInit(): void {
  }

}
