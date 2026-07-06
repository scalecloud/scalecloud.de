import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CancelSubscriptionClient } from './cancel-subscription-client';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCancelReply, SubscriptionCancelRequest } from './subscription-cancel-request-model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelSubscription } from './confirm-cancel-subscription/confirm-cancel-subscription';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.html',
  styleUrl: './cancel-subscription.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class CancelSubscription {
  private readonly auth = inject(Auth);
  private readonly cancelSubscriptionService = inject(CancelSubscriptionClient);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);


  readonly reloadSubscriptionDetail = output<void>();

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmCancelSubscription);
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.cancelSubscription();
      }
    });
  }

  cancelSubscription(): void {
    const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');
    if (!subscriptionID) {
      this.log.error('CancelSubscriptionComponent.cancelSubscription: id is null');
      return;
    }

    const request: SubscriptionCancelRequest = { subscriptionID };

    this.cancelSubscriptionService.cancelSubscription(request).subscribe({
      next: (reply: SubscriptionCancelReply) => {
        if (!reply) {
          this.log.error('CancelSubscriptionComponent.cancelSubscription: reply is null');
          return;
        }
        if (reply.cancel_at_period_end) {
          const date = new Date(reply.cancel_at * 1000);
          this.snackBar.info(`Your Subscription will cancel at: ${date}`);
          this.reloadSubscriptionDetail.emit();
        }
      },
    });
  }
}