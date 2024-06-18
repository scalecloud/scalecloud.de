import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Role, RoleDescriptions } from 'src/app/shared/roles/roles';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { DeleteSeatRequest, Seat, SeatDetailReply, SeatDetailRequest } from '../seats';
import { SeatDetailService } from './seat-detail.service';

@Component({
  selector: 'app-seat-detail',
  standalone: false,
  templateUrl: './seat-detail.component.html',
  styleUrl: './seat-detail.component.scss'
})
export class SeatDetailComponent {

  seatDetailReply: SeatDetailReply | null;
  loading = false;
  error = false;

  inviteUserRoles = Object.values(Role);
  roleDescriptions = RoleDescriptions;
  Roles = Role;
  selectedRoles: Role[] = [];

  seat: Seat | null;

  constructor(
    private authService: AuthService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private seatDetailService: SeatDetailService,
    private returnUrlService: ReturnUrlService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getSeatDetail();
  }

  toggleRoleSelection(role: Role): void {
    const index = this.selectedRoles.indexOf(role);
    if (index === -1) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles.splice(index, 1);
    }
  }

  getSeatDetail(): void {
    this.authService.waitForAuth().then(() => {

      const subscriptionID = this.route.snapshot.paramMap.get('id');
      const uid = this.route.snapshot.paramMap.get('uid');

      if (!subscriptionID) {
        this.logService.error('subscriptionID is null');
      }
      else if (!uid) {
        this.logService.error('uid is null');
      } else {
        let request: SeatDetailRequest = {
          subscriptionID: subscriptionID,
          uid: uid
        };
        this.loading = true;
        this.seatDetailService.getSeat(request)
          .subscribe({
            next: seatDetailReply => {
              this.seatDetailReply = seatDetailReply;
              this.loading = false;
              this.error = false;
            },
            error: error => {
              this.loading = false;
              this.error = true;
              this.snackBarService.error('Could not get list of seats. Please try again later.');
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  updateSeat(): void {
    // Save seat
  }

  deleteSeat(email: string): void {
    this.authService.waitForAuth().then(() => {

      const subscriptionID = this.route.snapshot.paramMap.get('id');

      if (!subscriptionID) {
        this.logService.error('SeatsComponent.invite: subscriptionID is null');
        this.snackBarService.error('Currently not possible to invite a user. Please try again later.');
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        let removeSeatRequest: DeleteSeatRequest = {
          subscriptionID: subscriptionID,
          email: email
        };
        this.seatDetailService.deleteSeat(removeSeatRequest)
          .subscribe(removeSeatReply => {
            if (removeSeatReply.success) {
              this.snackBarService.info(`Removed ${removeSeatReply?.email}.`);
              this.returnUrlService.openReturnURL('/dashboard');
            }
            else {
              this.snackBarService.error(`Could not remove ${removeSeatReply?.email}. Please rety.`);
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

}
