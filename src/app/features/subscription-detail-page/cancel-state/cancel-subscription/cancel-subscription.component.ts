import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { CancelSubscriptionService } from './cancel-subscription.service';
import { ActivatedRoute } from '@angular/router';
import { ISubscriptionCancelReply, ISubscriptionCancelRequest } from './subscription-cancel-request';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelSubscriptionComponent } from './confirm-cancel-subscription/confirm-cancel-subscription.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrl: './cancel-subscription.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class CancelSubscriptionComponent {
  private readonly auth = inject(Auth);
  private readonly cancelSubscriptionService = inject(CancelSubscriptionService);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);


  readonly reloadSubscriptionDetail = output<void>();

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmCancelSubscriptionComponent);
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

    const request: ISubscriptionCancelRequest = { subscriptionID };

    this.cancelSubscriptionService.cancelSubscription(request).subscribe({
      next: (reply: ISubscriptionCancelReply) => {
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