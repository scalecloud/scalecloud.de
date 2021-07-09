import { Component, OnInit } from '@angular/core';
import { SubscriptionType } from '../titel-card/titel-card.component';

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
