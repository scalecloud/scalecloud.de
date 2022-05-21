import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from './dashboard.service';
import { ISubscriptionOverview } from './subscription-overview';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subscriptionsOverview: ISubscriptionOverview[] = [];

  constructor(public authService: AuthService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getSubscriptions();
      }
    }
    );
  }

  getSubscriptions(): void {
    if (this.subscriptionsOverview != null) {
      this.dashboardService.getSubscriptionsOverview().subscribe(
        subscriptionsOverview => this.subscriptionsOverview = subscriptionsOverview);
    }
  }

}
