import { Component, OnInit } from '@angular/core';
import { SubscriptionType } from '../titel-card/titel-card.component';

@Component({
  selector: 'app-synology',
  templateUrl: './synology.component.html',
  styleUrls: ['./synology.component.scss']
})
export class SynologyComponent implements OnInit {

  subscriptionType = SubscriptionType.Synology;

  constructor() { }

  ngOnInit(): void {
  }

}
