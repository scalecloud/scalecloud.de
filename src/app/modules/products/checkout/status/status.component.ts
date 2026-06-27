import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutCreateSubscriptionReply } from '../checkout-create-subscription';
import { ActiveComponent } from './active/active.component';
import { TrailingComponent } from './trailing/trailing.component';


@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ActiveComponent, TrailingComponent]
})
export class StatusComponent implements OnInit {
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);


  checkoutCreateSubscriptionReply: CheckoutCreateSubscriptionReply;

  active: boolean = false;
  trialing: boolean = false;

  ngOnInit(): void {
    this.checkPaymentIntentStatus();
  }

  initParamMap(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.route.queryParams.subscribe(params => {
        this.checkoutCreateSubscriptionReply = params as CheckoutCreateSubscriptionReply;
        resolve();
      });
    });
  }

  async checkPaymentIntentStatus(): Promise<void> {
    await this.authService.waitForAuth();
    await this.initParamMap();

    let allValuesSet = Object.values(this.checkoutCreateSubscriptionReply).every(value => Boolean(value));

    if (!allValuesSet) {
      this.snackBarService.error("Error: Could not get payment status. Please try again later.");
    } else {
      switch (this.checkoutCreateSubscriptionReply.status) {
        case 'active': {
          this.logService.info("Success! Your payment method has been saved.")
          this.active = true;
          break;
        }

        case 'trialing': {
          this.logService.warn("Processing payment details. We'll update you when processing is complete.")
          this.trialing = true;
          break;
        }
      }
    }
  }
}