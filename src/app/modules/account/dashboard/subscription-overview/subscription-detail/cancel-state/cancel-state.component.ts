import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CancelStateReply } from './cancel-state';
import { CancelStateService } from './cancel-state.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ResumeSubscriptionComponent } from './resume-subscription/resume-subscription.component';
import { CancelSubscriptionComponent } from './cancel-subscription/cancel-subscription.component';
import { LoadingFailedComponent } from '../../../../../../shared/components/loading-failed/loading-failed.component';

@Component({
    selector: 'app-cancel-state',
    templateUrl: './cancel-state.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './cancel-state.component.scss',
    imports: [MatProgressBar, NgxSkeletonLoaderComponent, ResumeSubscriptionComponent, CancelSubscriptionComponent, LoadingFailedComponent]
})
export class CancelStateComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cancelStateService = inject(CancelStateService);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly permissionService = inject(PermissionService);
  private readonly route = inject(ActivatedRoute);


  @Output() reloadSubscriptionDetailEvent = new EventEmitter();
  ServiceStatus = ServiceStatus;
  reply: CancelStateReply | null;
  serviceStatus = ServiceStatus.Initializing;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  ngOnInit(): void {
    this.checkPermissions();
  }

  isEnding(): boolean {
    let isEnding = false;
    if (this.reply) {
      isEnding = this.reply?.cancel_at_period_end;
    }
    return isEnding;
  }

  async checkPermissions() {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('SeatsComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    try {
      const hasPermission = await this.permissionService.isBilling(subscriptionID);
      if (hasPermission) {
        this.getCancelState();
      } else {
        this.serviceStatus = ServiceStatus.NoPermission;
      }
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  getCancelState(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (!subscriptionID) {
        this.logService.error('SeatsComponent.getSeatsList: subscriptionID is null');
      } else {
        this.cancelStateService.getCancelState(subscriptionID)
          .subscribe({
            next: seatListReply => {
              this.reply = seatListReply;
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.serviceStatus = ServiceStatus.Error;
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }

  reloadSubscriptionDetail() {
    this.getCancelState();
    this.reloadSubscriptionDetailEvent.emit();
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }
}
