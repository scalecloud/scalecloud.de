import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SeatsService } from './seats.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ListSeatReply, ListSeatRequest } from './seats';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrl: './seats.component.scss'
})
export class SeatsComponent {

  @Input() subscriptionID: string | undefined;
  seatListReply: ListSeatReply | undefined;

  constructor(
    public authService: AuthService,
    private seatService: SeatsService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
  ) { }


  ngOnInit(): void {
    this.initSeatsList();
  }

  initSeatsList(): void {
    this.authService.waitForAuth().then(() => {

      if (!this.subscriptionID) {
        this.logService.error('SeatsComponent.initSeatsList: subscriptionID is null');
      } else {
        let seatListRequest: ListSeatRequest = {
          subscriptionID: this.subscriptionID
        };
        this.seatService.getListSeats(seatListRequest)
          .subscribe(seatListReply => this.seatListReply = seatListReply);
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  getCurrentSeats(): number {
    return this.seatListReply?.emails?.length || 0;
  }

  getMaxSeats(): number {
    return this.seatListReply?.max_seats || 0;
  }

  isAddSeatPossible(): boolean {
    return this.seatListReply?.emails?.length < this.seatListReply?.max_seats;
  }

  addSeat(): void {
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/subscription/' + this.subscriptionID + '/add-seat');
  }

}
