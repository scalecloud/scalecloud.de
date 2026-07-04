import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CheckoutCreateSubscriptionReply } from '../checkout-create-subscription';
import { ActiveComponent } from './active/active.component';
import { TrailingComponent } from './trailing/trailing.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActiveComponent, TrailingComponent],
})
export class StatusComponent implements OnInit {
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly checkoutCreateSubscriptionReply = signal<CheckoutCreateSubscriptionReply | undefined>(undefined);
  readonly active = computed(() => this.checkoutCreateSubscriptionReply()?.status === 'active');
  readonly trialing = computed(() => this.checkoutCreateSubscriptionReply()?.status === 'trialing');

  ngOnInit(): void {
    this.checkPaymentIntentStatus();
  }

  async checkPaymentIntentStatus(): Promise<void> {
    try {
      await this.authService.waitForAuth();
    } catch (error) {
      this.logService.error(`waitForAuth failed: ${error}`);
      this.snackBarService.error('Error: Could not get payment status. Please try again later.');
      return;
    }

    const params = await firstValueFrom(this.route.queryParams);
    const reply = params as CheckoutCreateSubscriptionReply;
    const allValuesSet = Object.values(reply).every((value) => Boolean(value));

    if (!allValuesSet) {
      this.snackBarService.error('Error: Could not get payment status. Please try again later.');
      return;
    }

    this.checkoutCreateSubscriptionReply.set(reply);

    switch (reply.status) {
      case 'active':
        this.logService.info('Success! Your payment method has been saved.');
        break;

      case 'trialing':
        this.logService.warn("Processing payment details. We'll update you when processing is complete.");
        break;
    }
  }
}