import { Component, Input, OnInit } from '@angular/core';
import { ISubscription } from '../subscription';

@Component({
  selector: 'app-dashboard-subscription-card',
  templateUrl: './dashboard-subscription-card.component.html',
  styleUrls: ['./dashboard-subscription-card.component.scss']
})
export class DashboardSubscriptionCardComponent implements OnInit {

  @Input() subscription: ISubscription | undefined;

  ngOnInit(): void {
  }

  getTitle(): string {
    let ret = '';
    if( this.subscription != null ) {
      ret = this.subscription.title;
    }
    return ret;
  }
    

}
