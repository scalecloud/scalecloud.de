import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subscriptionsOverview: ISubscriptionOverview[] = [];

  constructor(
    public authService: AuthService, 
    private subscriptionOverviewService: SubscriptionOverviewService
    ) { }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getSubscriptionsOverview();
      }
    }
    );
  }

  getSubscriptionsOverview(): void {
    if (this.subscriptionsOverview != null) {
      this.subscriptionOverviewService.getSubscriptionsOverview().subscribe(
        subscriptionsOverview => this.subscriptionsOverview = subscriptionsOverview);
    }
  }

}
