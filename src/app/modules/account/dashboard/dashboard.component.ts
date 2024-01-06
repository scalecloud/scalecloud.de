import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PaymentOverviewComponent } from './payment-overview/payment-overview.component';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(PaymentOverviewComponent) paymentOverviewComponent: PaymentOverviewComponent | undefined;
  subscriptionsOverview: ISubscriptionOverview[] = [];

  constructor(
    public authService: AuthService,
    private subscriptionOverviewService: SubscriptionOverviewService,
    private logService: LogService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.getSubscriptionsOverview();
  }

  ngAfterViewInit(): void {
    this.paymentOverviewComponent?.initPaymentMethodOverview().then((hasPaymentMethod) => {
      if (hasPaymentMethod) {
        this.logService.info("Fetched payment method overview.");
      } else {
        this.logService.warn("User has no payment method. UID: " + this.authService.getUser()?.uid );
      }
    }).catch((error) => {
      this.logService.error("Error: " + error);
    });
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
