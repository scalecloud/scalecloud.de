import { Component, OnInit, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LogService } from 'src/app/core/logging/log.service';
import { PermissionService } from 'src/app/core/permission/permission.service';
import { ServiceStatus } from 'src/app/shared/service-status';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { CancelStateReply } from './cancel-state';
import { CancelStateService } from './cancel-state.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ResumeSubscriptionComponent } from './resume-subscription/resume-subscription.component';
import { CancelSubscriptionComponent } from './cancel-subscription/cancel-subscription.component';
import { LoadingFailedComponent } from '../../../shared/loading-failed/loading-failed.component';
import { Auth } from 'src/app/core/auth/auth';

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
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly permissionService = inject(PermissionService);
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
      this.logService.error('SeatsComponent.checkPermissions: error checking permissions', error);
    }
  }

  async getCancelState(): Promise<void> {
    this.serviceStatus = ServiceStatus.Loading;

    try {
      await this.auth.waitForAuth();
    } catch (error) {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('SeatsComponent.getSeatsList: subscriptionID is null');
      return;
    }

    try {
      this.reply = await firstValueFrom(this.cancelStateService.getCancelState(subscriptionID));
      this.serviceStatus = ServiceStatus.Success;
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.logService.error('SeatsComponent.getSeatsList: error fetching cancel state', error);
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