import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PaymentOverviewComponent } from './payment-overview/payment-overview.component';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { LastCountService } from './subscription-overview/LastCount/last-count.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(PaymentOverviewComponent) paymentOverviewComponent: PaymentOverviewComponent | undefined;
  reply: ISubscriptionOverview[] = [];
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  constructor(
    public authService: AuthService,
    private subscriptionOverviewService: SubscriptionOverviewService,
    private logService: LogService,
    public lastCountService: LastCountService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.getSubscriptionsOverview();
  }

  getSubscriptionsOverview(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      this.subscriptionOverviewService.getSubscriptionsOverview()
        .subscribe({
          next: subscriptionsOverview => {
            this.reply = subscriptionsOverview;
            this.lastCountService.setLastSubscriptionOverviewCount = subscriptionsOverview.length;
            this.serviceStatus = ServiceStatus.Success;
          },
          error: error => {
            this.serviceStatus = ServiceStatus.Error;
            this.snackBarService.error(error);
          }
        });
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }
}
