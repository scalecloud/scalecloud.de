import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SeatsService } from '../seats/seats.service';
import { CancelStateReply } from './cancel-state';
import { CancelStateService } from './cancel-state.service';

@Component({
  selector: 'app-cancel-state',
  standalone: false,
  templateUrl: './cancel-state.component.html',
  styleUrl: './cancel-state.component.scss'
})
export class CancelStateComponent implements OnInit {

  ServiceStatus = ServiceStatus;
  reply: CancelStateReply | null;
  serviceStatus = ServiceStatus.Initializing;


  constructor(
    public authService: AuthService,
    private cancelStateService: CancelStateService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
  ) { }

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
      const hasPermission = await this.permissionService.isAdministrator(subscriptionID);
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
              this.snackBarService.error('Could not initialize component to cancel or resume subscription. Please try again later.');
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }

  reloadSubscriptionDetail() {
    throw new Error('Method not implemented.');
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }
}
