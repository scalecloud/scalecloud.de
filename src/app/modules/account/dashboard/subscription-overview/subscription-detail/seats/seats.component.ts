import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SeatsService } from './seats.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ListSeatReply, ListSeatRequest, Seat } from './seats';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { PageEvent } from '@angular/material/paginator';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss']
})
export class SeatsComponent implements OnInit {
  ServiceStatus = ServiceStatus;
  seatListReply: ListSeatReply | null;
  serviceStatus = ServiceStatus.Initializing;

  pageSize = 5;
  pageIndex = 0;

  hidePageSize = true;
  showFirstLastButtons = false;

  pageEvent: PageEvent;

  constructor(
    public authService: AuthService,
    private seatService: SeatsService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
  ) { }

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
              this.snackBarService.error('Could not get list of seats. Please try again later.');
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