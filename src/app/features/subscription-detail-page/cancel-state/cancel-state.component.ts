import { Component, OnInit, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ServiceStatus } from 'src/app/shared/service-status';
import { CancelStateReply } from './cancel-state';
import { CancelStateService } from './cancel-state.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ResumeSubscriptionComponent } from './resume-subscription/resume-subscription.component';
import { CancelSubscriptionComponent } from './cancel-subscription/cancel-subscription.component';
import { LoadingFailedComponent } from '../../../shared/loading-failed/loading-failed.component';
import { Auth } from 'src/app/core/auth/auth';
import { Permission } from 'src/app/core/permission/permission';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

@Component({
    selector: 'app-cancel-state',
    templateUrl: './cancel-state.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './cancel-state.component.scss',
    imports: [MatProgressBar, NgxSkeletonLoaderComponent, ResumeSubscriptionComponent, CancelSubscriptionComponent, LoadingFailedComponent]
})
export class CancelStateComponent implements OnInit {
  private readonly auth = inject(Auth);
  private readonly cancelStateService = inject(CancelStateService);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly permission = inject(Permission);
  private readonly route = inject(ActivatedRoute);


  readonly reloadSubscriptionDetailEvent = output();
  ServiceStatus = ServiceStatus;
  reply: CancelStateReply | null;
  serviceStatus = ServiceStatus.Initializing;

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
      this.log.error('SeatsComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    try {
      const hasPermission = await this.permission.isBilling(subscriptionID);
      if (hasPermission) {
        this.getCancelState();
      } else {
        this.serviceStatus = ServiceStatus.NoPermission;
      }
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.snackBar.error('An error occurred while checking permissions.');
      this.log.error('SeatsComponent.checkPermissions: error checking permissions', error);
    }
  }

  async getCancelState(): Promise<void> {
    this.serviceStatus = ServiceStatus.Loading;

    try {
      await this.auth.waitForAuth();
    } catch (error) {
      this.log.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.log.error('SeatsComponent.getSeatsList: subscriptionID is null');
      return;
    }

    try {
      this.reply = await firstValueFrom(this.cancelStateService.getCancelState(subscriptionID));
      this.serviceStatus = ServiceStatus.Success;
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.log.error('SeatsComponent.getSeatsList: error fetching cancel state', error);
    }
  }

  reloadSubscriptionDetail() {
    this.getCancelState();
    this.reloadSubscriptionDetailEvent.emit();
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }
}