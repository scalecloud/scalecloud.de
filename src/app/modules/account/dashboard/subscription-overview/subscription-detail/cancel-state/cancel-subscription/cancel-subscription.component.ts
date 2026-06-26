import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CancelSubscriptionService } from './cancel-subscription.service';
import { ActivatedRoute } from '@angular/router';
import { ISubscriptionCancelReply, ISubscriptionCancelRequest } from './subscription-cancel-request';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelSubscriptionComponent } from './confirm-cancel-subscription/confirm-cancel-subscription.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrl: './cancel-subscription.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class CancelSubscriptionComponent {

  @Output() reloadSubscriptionDetail = new EventEmitter<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly cancelSubscriptionService: CancelSubscriptionService,
    private readonly logService: LogService,
    private readonly snackBarService: SnackBarService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
  ) { }

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
      this.logService.error('CancelSubscriptionComponent.cancelSubscription: id is null');
      return;
    }

    const request: ISubscriptionCancelRequest = { subscriptionID };

    this.cancelSubscriptionService.cancelSubscription(request).subscribe({
      next: (reply: ISubscriptionCancelReply) => {
        if (!reply) {
          this.logService.error('CancelSubscriptionComponent.cancelSubscription: reply is null');
          return;
        }
        if (reply.cancel_at_period_end) {
          const date = new Date(reply.cancel_at * 1000);
          this.snackBarService.info(`Your Subscription will cancel at: ${date}`);
          this.reloadSubscriptionDetail.emit();
        }
      },
    });
  }
}