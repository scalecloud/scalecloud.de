import { Component, OnInit } from '@angular/core';
import { SubscriptionType } from '../SubscriptionType';

@Component({
  selector: 'app-nextcloud',
  templateUrl: './nextcloud.component.html',
  styleUrls: ['./nextcloud.component.scss']
})
export class NextcloudComponent implements OnInit {

  subscriptionType = SubscriptionType.Nextcloud;

  constructor() { }

  ngOnInit(): void {
  }

}
