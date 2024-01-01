import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';
import { LogService } from 'src/app/shared/services/log/log.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subscriptionsOverview: ISubscriptionOverview[] = [];

  constructor(
    public authService: AuthService,
    private subscriptionOverviewService: SubscriptionOverviewService,
    private logService: LogService,
  ) { }

  ngOnInit(): void {
    this.getSubscriptionsOverview();
  }

  getSubscriptionsOverview(): void {
    this.authService.waitForAuth().then(() => {
      if (this.subscriptionsOverview != null) {
        this.subscriptionOverviewService.getSubscriptionsOverview().subscribe(
          subscriptionsOverview => this.subscriptionsOverview = subscriptionsOverview);
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }
}
