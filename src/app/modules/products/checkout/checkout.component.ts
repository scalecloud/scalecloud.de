import { Component, ViewChild, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from './checkout-create-subscription';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CheckoutSubscriptionService } from './payment-element/checkout-subscription.service';
import { PaymentOverviewComponent } from 'src/app/modules/account/dashboard/payment-overview/payment-overview.component';
import { PaymentOverviewComponent as PaymentOverviewComponent_1 } from '../../account/dashboard/payment-overview/payment-overview.component';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PaymentOverviewComponent_1, CheckoutDetailsComponent]
})
export class CheckoutComponent {
  private readonly logService = inject(LogService);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);
  private readonly authService = inject(AuthService);
  private readonly checkoutSubscriptionService = inject(CheckoutSubscriptionService);

  @ViewChild(PaymentOverviewComponent) paymentOverviewComponent: PaymentOverviewComponent | undefined;
  @ViewChild(CheckoutDetailsComponent) checkoutDetailsComponent: CheckoutDetailsComponent | undefined;
  productID: string | undefined;

  createCheckoutSubscription(checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest): void {
    this.authService.waitForAuth().then(() => {
      const errorMessage = "Could not create Subscription. Please try again.";

      if (!checkoutIntegrationRequest || !checkoutIntegrationRequest.productID || !checkoutIntegrationRequest.quantity || checkoutIntegrationRequest.quantity < 1) {
        this.snackBarService.error(errorMessage);
        return;
      }

      this.checkoutSubscriptionService.createCheckoutSubscription(checkoutIntegrationRequest).subscribe(
        (checkoutIntegrationReply: CheckoutCreateSubscriptionReply) => {
          if (!checkoutIntegrationReply || !checkoutIntegrationReply.status) {
            this.snackBarService.error(errorMessage);
            return;
          }

          if (checkoutIntegrationReply.status === 'active' || checkoutIntegrationReply.status === 'trialing') {
            this.snackBarService.info("Subscription created.");
            this.router.navigate(['/checkout/status'], { queryParams: checkoutIntegrationReply });
          } else {
            this.snackBarService.error("Could not charge payment method. Please update your payment method.");
          }
        });
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

}
