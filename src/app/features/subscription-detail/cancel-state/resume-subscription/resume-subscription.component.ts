import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ConfirmResumeSubscriptionComponent } from './confirm-resume-subscription/confirm-resume-subscription.component';
import { ResumeSubscriptionService } from './resume-subscription.service';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

@Component({
  selector: 'app-resume-subscription',
  templateUrl: './resume-subscription.component.html',
  styleUrls: ['./resume-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class ResumeSubscriptionComponent {
  private readonly resumeSubscriptionService = inject(ResumeSubscriptionService);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = takeUntilDestroyed();

  readonly reloadSubscriptionDetail = output<void>();

  openConfirmDialog(): void {
    this.dialog
      .open(ConfirmResumeSubscriptionComponent)
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

    this.resumeSubscriptionService
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