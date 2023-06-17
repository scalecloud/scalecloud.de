import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { CancelSubscriptionService } from './cancel-subscription.service';
import { ActivatedRoute } from '@angular/router';
import { ISubscriptionCancelReply, ISubscriptionCancelRequest } from './subscription-cancel-request';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelSubscriptionComponent } from './confirm-cancel-subscription/confirm-cancel-subscription.component';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrls: ['./cancel-subscription.component.scss']
})
export class CancelSubscriptionComponent {

  constructor(
    public authService: AuthService,
    private cancelSubscriptionService: CancelSubscriptionService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmCancelSubscriptionComponent);
    dialogRef.afterClosed().subscribe(cancel => {
      if (cancel == true) {
        this.cancelSubscription();
      }
    });
  }

  cancelSubscription(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      this.logService.error('CancelSubscriptionComponent.cancelSubscription: id is null');
    } else {

      const iSubscriptionCancelRequest: ISubscriptionCancelRequest = {
        id: id
      }

      const observable = this.cancelSubscriptionService.cancelSubscription(iSubscriptionCancelRequest).subscribe(
        (iSubscriptionCancelReply: ISubscriptionCancelReply) => {
          if (iSubscriptionCancelReply == null) {
            this.logService.error('CancelSubscriptionComponent.cancelSubscription: iSubscriptionCancelReply is null');
          }
          else {
            if (iSubscriptionCancelReply.cancel_at_period_end) {
              var date = new Date(iSubscriptionCancelReply.cancel_at * 1000);
              this.snackBarService.info(`Your Subscription will cancel at: ` + date);
            }
          }
        });
    }
  }

}

