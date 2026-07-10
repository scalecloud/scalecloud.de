import { Component, OnInit, ChangeDetectionStrategy, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ServiceStatus } from 'src/app/shared/client-status';
import { CancelStateReply } from './cancel-state-model';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { ResumeSubscription } from './resume-subscription/resume-subscription';
import { CancelSubscription } from './cancel-subscription/cancel-subscription';
import { LoadingFailed } from '../../../shared/loading-failed/loading-failed';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { CancelStateClient } from './cancel-state-client';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';

@Component({
    selector: 'app-cancel-state',
    templateUrl: './cancel-state.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './cancel-state.scss',
    imports: [MatProgressBar, NgxSkeletonLoaderComponent, ResumeSubscription, CancelSubscription, LoadingFailed]
})
export class CancelState implements OnInit {
  private readonly auth = inject(Auth);
  private readonly cancelStateClient = inject(CancelStateClient);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly permissionStore = inject(PermissionStore);
  private readonly route = inject(ActivatedRoute);


  readonly reloadSubscriptionDetailEvent = output();
  readonly ServiceStatus = ServiceStatus;
  readonly reply = signal<CancelStateReply | null>(null);
  readonly serviceStatus = signal<ServiceStatus>(ServiceStatus.Initializing);

  ngOnInit(): void {
    this.checkPermissions();
  }

  isEnding(): boolean {
    const reply = this.reply();
    return reply?.cancel_at_period_end ?? false;
  }

  async checkPermissions() {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.log.error('SeatsComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    try {
      const hasPermission = await this.permissionStore.isBilling(subscriptionID);
      if (hasPermission) {
        this.getCancelState();
      } else {
        this.serviceStatus.set(ServiceStatus.NoPermission);
      }
    } catch (error) {
      this.serviceStatus.set(ServiceStatus.Error);
      this.snackBar.error('An error occurred while checking permissions.');
      this.log.error('SeatsComponent.checkPermissions: error checking permissions', error);
    }
  }

  async getCancelState(): Promise<void> {
    this.serviceStatus.set(ServiceStatus.Loading);

    try {
      await this.auth.waitForAuth();
    } catch (error) {
      this.log.error("waitForAuth failed: " + error);
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.log.error('SeatsComponent.getSeatsList: subscriptionID is null');
      return;
    }

    try {
      this.reply.set(await firstValueFrom(this.cancelStateClient.getCancelState(subscriptionID)));
      this.serviceStatus.set(ServiceStatus.Success);
    } catch (error) {
      this.serviceStatus.set(ServiceStatus.Error);
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