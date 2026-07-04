import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LogService } from 'src/app/core/logging/log.service';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { CheckoutCreateSubscriptionReply, CheckoutCreateSubscriptionRequest } from './checkout-create-subscription';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CheckoutSubscriptionService } from './payment-element/checkout-subscription.service';
import { PaymentOverviewComponent } from 'src/app/modules/account/dashboard/payment-overview/payment-overview.component';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PaymentOverviewComponent, CheckoutDetailsComponent]
})
export class CheckoutComponent {
  private readonly logService = inject(LogService);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackBarService);
  private readonly authService = inject(AuthService);
  private readonly checkoutSubscriptionService = inject(CheckoutSubscriptionService);

  async createCheckoutSubscription(checkoutIntegrationRequest: CheckoutCreateSubscriptionRequest): Promise<void> {
    const errorMessage = 'Could not create Subscription. Please try again.';

    if (!checkoutIntegrationRequest?.productID || !checkoutIntegrationRequest.quantity || checkoutIntegrationRequest.quantity < 1) {
      this.snackBarService.error(errorMessage);
      return;
    }

    try {
      await this.authService.waitForAuth();

      const checkoutIntegrationReply: CheckoutCreateSubscriptionReply = await firstValueFrom(
        this.checkoutSubscriptionService.createCheckoutSubscription(checkoutIntegrationRequest),
      );

      if (!checkoutIntegrationReply?.status) {
        this.snackBarService.error(errorMessage);
        return;
      }

      if (checkoutIntegrationReply.status === 'active' || checkoutIntegrationReply.status === 'trialing') {
        this.snackBarService.info('Subscription created.');
        this.router.navigate(['/checkout/status'], { queryParams: checkoutIntegrationReply });
      } else {
        this.snackBarService.error('Could not charge payment method. Please update your payment method.');
      }
    } catch (error) {
      this.logService.error('createCheckoutSubscription failed: ' + error);
      this.snackBarService.error(errorMessage);
    }
  }

}