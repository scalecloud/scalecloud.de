import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ResumeSubscriptionService } from './resume-subscription.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmResumeSubscriptionComponent } from './confirm-resume-subscription/confirm-resume-subscription.component';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';

@Component({
  selector: 'app-resume-subscription',
  templateUrl: './resume-subscription.component.html',
  styleUrls: ['./resume-subscription.component.scss']
})
export class ResumeSubscriptionComponent {

  @Output() reloadSubscriptionDetail = new EventEmitter();

  constructor(
    public authService: AuthService,
    private resumeSubscriptionService: ResumeSubscriptionService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmResumeSubscriptionComponent);
    dialogRef.afterClosed().subscribe(resume => {
      if (resume == true) {
        this.resumeSubscription();
      }
    });
  }

  resumeSubscription(): void {
    const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');
    if (subscriptionID == null) {
      this.logService.error('ResumeSubscriptionComponent.resumeSubscription: id is null');
    } else {

      const iSubscriptionResumeRequest: ISubscriptionResumeRequest = {
        subscriptionID: subscriptionID
      }

      const observable = this.resumeSubscriptionService.resumeSubscription(iSubscriptionResumeRequest).subscribe(
        (iSubscriptionResumeReply: ISubscriptionResumeReply) => {
          if (iSubscriptionResumeReply == null) {
            this.logService.error('ResumeSubscriptionComponent.resumeSubscription: iSubscriptionResumeReply is null');
          }
          else {
            if (iSubscriptionResumeReply.cancel_at_period_end) {
              this.snackBarService.error(`Your Subscription is still canceled.`);
            }
            else {
              this.snackBarService.info(`Your Subscription has been resumed.`);
              this.reloadSubscriptionDetail.emit();
            }
          }
        });
    }
  }


}
