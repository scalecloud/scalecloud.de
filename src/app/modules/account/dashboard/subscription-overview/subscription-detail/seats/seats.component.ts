import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SeatsService } from './seats.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ListSeatReply, ListSeatRequest, Seat } from './seats';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { PageEvent } from '@angular/material/paginator';
import { ServiceStatus } from 'src/app/shared/services/service-status';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrl: './seats.component.scss'
})
export class SeatsComponent {
  ServiceStatus = ServiceStatus;
  @Input() subscriptionID: string | null;
  seatListReply: ListSeatReply | null;
  serviceStatus = ServiceStatus.Error;

  pageSize = 5;
  pageIndex = 0;

  hidePageSize = true;
  showFirstLastButtons = false;

  pageEvent: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.getSeatsList();
  }

  constructor(
    public authService: AuthService,
    private seatService: SeatsService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
  ) { }


  ngOnInit(): void {
    this.getSeatsList();
  }

  getSeatsList(): void {
    this.authService.waitForAuth().then(() => {

      if (!this.subscriptionID) {
        this.logService.error('SeatsComponent.getSeatsList: subscriptionID is null');
      } else {
        let request: ListSeatRequest = {
          subscriptionID: this.subscriptionID,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        };
        this.serviceStatus = ServiceStatus.Loading;
        this.seatService.getListSeats(request)
          .subscribe({
            next: seatListReply => {
              this.seatListReply = seatListReply;
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.snackBarService.error('Could not get list of seats. Please try again later.');
              this.serviceStatus = ServiceStatus.Error;
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
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
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/subscription/' + this.subscriptionID + '/add-seat');
  }

  openSeatDetail(seat: Seat): void {
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/subscription/' + this.subscriptionID + '/' + seat.uid + '/seat-detail');
  }

}
