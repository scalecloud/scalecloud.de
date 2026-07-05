import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CheckoutCreateSubscriptionReply } from '../checkout-create-subscription';
import { ActiveComponent } from './active/active.component';
import { TrailingComponent } from './trailing/trailing.component';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActiveComponent, TrailingComponent],
})
export class StatusComponent implements OnInit {
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(Auth);

  readonly checkoutCreateSubscriptionReply = signal<CheckoutCreateSubscriptionReply | undefined>(undefined);
  readonly active = computed(() => this.checkoutCreateSubscriptionReply()?.status === 'active');
  readonly trialing = computed(() => this.checkoutCreateSubscriptionReply()?.status === 'trialing');

  ngOnInit(): void {
    this.checkPaymentIntentStatus();
  }

  async checkPaymentIntentStatus(): Promise<void> {
    try {
      await this.auth.waitForAuth();
    } catch (error) {
      this.log.error(`waitForAuth failed: ${error}`);
      this.snackBar.error('Error: Could not get payment status. Please try again later.');
      return;
    }

    const params = await firstValueFrom(this.route.queryParams);
    const reply = params as CheckoutCreateSubscriptionReply;
    const allValuesSet = Object.values(reply).every((value) => Boolean(value));

    if (!allValuesSet) {
      this.snackBar.error('Error: Could not get payment status. Please try again later.');
      return;
    }

    this.checkoutCreateSubscriptionReply.set(reply);

    switch (reply.status) {
      case 'active':
        this.log.info('Success! Your payment method has been saved.');
        break;

      case 'trialing':
        this.log.warn("Processing payment details. We'll update you when processing is complete.");
        break;
    }
  }
}