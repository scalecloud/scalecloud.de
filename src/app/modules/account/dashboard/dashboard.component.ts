import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PaymentOverviewComponent } from './payment-overview/payment-overview.component';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { LastCountService } from './subscription-overview/LastCount/last-count.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { SubscriptionOverviewComponent } from './subscription-overview/subscription-overview.component';
import { LoadingFailedComponent } from '../../../shared/components/loading-failed/loading-failed.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatProgressBar, MatCardTitle, NgxSkeletonLoaderComponent, MatCardSubtitle, MatDivider, MatCardContent, MatList, MatListItem, SubscriptionOverviewComponent, LoadingFailedComponent]
})
export class DashboardComponent implements OnInit {

  @ViewChild(PaymentOverviewComponent) paymentOverviewComponent: PaymentOverviewComponent | undefined;
  reply: ISubscriptionOverview[] = [];
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  constructor(
    private readonly authService: AuthService,
    private readonly subscriptionOverviewService: SubscriptionOverviewService,
    private readonly logService: LogService,
    public readonly lastCountService: LastCountService,
    private readonly snackBarService: SnackBarService,
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
          }
        });
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }
}
