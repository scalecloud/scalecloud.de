import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CheckoutDetails } from './checkout-details/checkout-details';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from './checkout-create-subscription';
import { CheckoutSubscriptionClient } from './checkout-payment/checkout-subscription-client';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { PaymentMethodOverviewComponent } from '../../dashboard-page/payment-method-overview/payment-method-overview.component';

@Component({
    selector: 'app-checkout-page',
    templateUrl: './checkout-page.html',
    styleUrls: ['./checkout-page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PaymentMethodOverviewComponent, CheckoutDetails]
})
export class CheckoutPage {
  private readonly log = inject(Log);
  private readonly router = inject(Router);
  private readonly snackBar = inject(SnackBar);
  private readonly auth = inject(Auth);
  private readonly checkoutSubscriptionService = inject(CheckoutSubscriptionClient);

  async createCheckoutSubscription(checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest): Promise<void> {
    const errorMessage = 'Could not create Subscription. Please try again.';

    if (!checkoutIntegrationRequest?.productID || !checkoutIntegrationRequest.quantity || checkoutIntegrationRequest.quantity < 1) {
      this.snackBar.error(errorMessage);
      return;
    }

    try {
      await this.auth.waitForAuth();

      const checkoutIntegrationReply: CheckoutCreateSubscriptionReply = await firstValueFrom(
        this.checkoutSubscriptionService.createCheckoutSubscription(checkoutIntegrationRequest),
      );

      if (!checkoutIntegrationReply?.status) {
        this.snackBar.error(errorMessage);
        return;
      }

      if (checkoutIntegrationReply.status === 'active' || checkoutIntegrationReply.status === 'trialing') {
        this.snackBar.info('Subscription created.');
        this.router.navigate(['/checkout/status'], { queryParams: checkoutIntegrationReply });
      } else {
        this.snackBar.error('Could not charge payment method. Please update your payment method.');
      }
    } catch (error) {
      this.log.error('createCheckoutSubscription failed: ' + error);
      this.snackBar.error(errorMessage);
    }
  }

}