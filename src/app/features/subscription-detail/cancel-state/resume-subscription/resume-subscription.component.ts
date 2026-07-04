import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/core/logging/log.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { ConfirmResumeSubscriptionComponent } from './confirm-resume-subscription/confirm-resume-subscription.component';
import { ResumeSubscriptionService } from './resume-subscription.service';
import { ISubscriptionResumeReply, ISubscriptionResumeRequest } from './subscription-resume';

@Component({
  selector: 'app-resume-subscription',
  templateUrl: './resume-subscription.component.html',
  styleUrls: ['./resume-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class ResumeSubscriptionComponent {
  private readonly resumeSubscriptionService = inject(ResumeSubscriptionService);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
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
      this.logService.error('ResumeSubscriptionComponent.resumeSubscription: id is null');
      return;
    }

    const request: ISubscriptionResumeRequest = { subscriptionID };

    this.resumeSubscriptionService
      .resumeSubscription(request)
      .pipe(this.destroyRef)
      .subscribe((reply: ISubscriptionResumeReply) => {
        if (reply == null) {
          this.logService.error(
            'ResumeSubscriptionComponent.resumeSubscription: reply is null',
          );
        } else if (reply.cancel_at_period_end) {
          this.snackBarService.error('Your Subscription is still canceled.');
        } else {
          this.snackBarService.info('Your Subscription has been resumed.');
          this.reloadSubscriptionDetail.emit();
        }
      });
  }
}