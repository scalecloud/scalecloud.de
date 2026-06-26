import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SeatsService } from './seats.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ListSeatReply, ListSeatRequest, Seat } from './seats';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LoadingFailedComponent } from '../../../../../../shared/components/loading-failed/loading-failed.component';

@Component({
    selector: 'app-seats',
    templateUrl: './seats.component.html',
    styleUrls: ['./seats.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatProgressBar, MatCardTitle, MatIcon, MatCardSubtitle, NgxSkeletonLoaderComponent, MatDivider, MatCardContent, MatList, MatCardActions, MatButton, MatListItem, MatTooltip, MatPaginator, LoadingFailedComponent]
})
export class SeatsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly seatService = inject(SeatsService);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly returnUrlService = inject(ReturnUrlService);
  private readonly permissionService = inject(PermissionService);
  private readonly route = inject(ActivatedRoute);

  seatListReply: ListSeatReply | null;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  pageSize = 5;
  pageIndex = 0;

  hidePageSize = true;
  showFirstLastButtons = false;

  pageEvent: PageEvent;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  ngOnInit(): void {
    this.checkPermissions();
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
        this.getSeatsList();
      } else {
        this.serviceStatus = ServiceStatus.NoPermission;
      }
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  getSeatsList(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (!subscriptionID) {
        this.logService.error('SeatsComponent.getSeatsList: subscriptionID is null');
      } else {
        let request: ListSeatRequest = {
          subscriptionID: subscriptionID,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        };
        this.seatService.getListSeats(request)
          .subscribe({
            next: seatListReply => {
              this.seatListReply = seatListReply;
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

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.getSeatsList();
  }

  getUsedSeats(): number {
    return this.seatListReply?.totalResults || 0;
  }

  getMaxSeats(): number {
    return this.seatListReply?.maxSeats || 0;
  }

  isAddSeatPossible(): boolean {
    return this.seatListReply?.seats?.length < this.seatListReply?.maxSeats;
  }

  addSeat(): void {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.snackBarService.error('Could not add seat. Please try again later.');
      return;
    }
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/subscription/' + subscriptionID + '/add-seat');
  }

  openSeatDetail(seat: Seat): void {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.snackBarService.error('Could not open seat detail. Please try again later.');
      return;
    }
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/subscription/' + subscriptionID + '/' + seat.uid + '/seat-detail');
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }
}