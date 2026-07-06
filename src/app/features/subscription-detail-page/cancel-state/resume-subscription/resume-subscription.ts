import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ConfirmResumeSubscription } from './confirm-resume-subscription/confirm-resume-subscription';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { ResumeSubscriptionClient } from './resume-subscription-client';

@Component({
  selector: 'app-resume-subscription',
  templateUrl: './resume-subscription.html',
  styleUrls: ['./resume-subscription.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class ResumeSubscription {
  private readonly resumeSubscriptionClient = inject(ResumeSubscriptionClient);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = takeUntilDestroyed();

  readonly reloadSubscriptionDetail = output<void>();

  openConfirmDialog(): void {
    this.dialog
      .open(ConfirmResumeSubscription)
      .afterClosed()
      .pipe(this.destroyRef)
      .subscribe((resume: boolean) => {
        if (resume) {
          this.resumeSubscription();
        }
      });
  }

  resumeSubscription(): void {
    const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');

    if (subscriptionID == null) {
      this.log.error('ResumeSubscriptionComponent.resumeSubscription: id is null');
      return;
    }

    const request: ISubscriptionResumeRequest = { subscriptionID };

    this.resumeSubscriptionClient
      .resumeSubscription(request)
      .pipe(this.destroyRef)
      .subscribe((reply: ISubscriptionResumeReply) => {
        if (reply == null) {
          this.log.error(
            'ResumeSubscriptionComponent.resumeSubscription: reply is null',
          );
        } else if (reply.cancel_at_period_end) {
          this.snackBar.error('Your Subscription is still canceled.');
        } else {
          this.snackBar.info('Your Subscription has been resumed.');
          this.reloadSubscriptionDetail.emit();
        }
      });
  }
}