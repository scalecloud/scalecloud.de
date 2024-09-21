import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Role, RoleDescriptions } from 'src/app/shared/roles/roles';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { DeleteSeatRequest, Seat, SeatDetailReply, SeatDetailRequest, UpdateSeatDetailRequest } from '../seats';
import { SeatDetailService } from './seat-detail.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmOwnerTransferComponent } from './confirm-owner-transfer/confirm-owner-transfer.component';

@Component({
  selector: 'app-seat-detail',
  standalone: false,
  templateUrl: './seat-detail.component.html',
  styleUrl: './seat-detail.component.scss'
})
export class SeatDetailComponent {

  seatDetailReply: SeatDetailReply | null;
  seatWithUpdates: Seat | null;
  loading = false;
  error = false;

  allRoles = Object.values(Role);
  roleDescriptions = RoleDescriptions;
  Roles = Role;

  constructor(
    private authService: AuthService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private seatDetailService: SeatDetailService,
    private returnUrlService: ReturnUrlService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getSeatDetail();
  }

  toggleRoleSelection(role: Role) {
    if (!this.seatWithUpdates.roles.includes(role)) {
      this.addRole(role);
    } else {
      this.removeRole(role);
    }
    this.askOwnerTransfer(role);
  }

  askOwnerTransfer(role: Role): void {
    if (role === Role.Owner && this.seatWithUpdates.roles.includes(role)) {
      const dialogRef = this.dialog.open(ConfirmOwnerTransferComponent, {
        data: {
          email: this.seatWithUpdates.email
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.removeRole(role);
        }
      });
    }
  }

  addRole(role: Role) {
    if (this.seatWithUpdates) {
      if (!this.seatWithUpdates.roles.includes(role)) {
        this.seatWithUpdates.roles.push(role);
      }
    } else {
      this.logService.error('updatedSeat is null');
    }
  }

  removeRole(role: Role) {
    if (this.seatWithUpdates) {
      const index = this.seatWithUpdates.roles.indexOf(role);
      if (index > -1) {
        this.seatWithUpdates.roles.splice(index, 1);
      }
    } else {
      this.logService.error('updatedSeat is null');
    }
  }

  getSeatDetail(): void {
    this.authService.waitForAuth().then(() => {

      const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');
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
            next: reply => {
              this.seatDetailReply = reply;
              this.seatWithUpdates = JSON.parse(JSON.stringify(reply.selectedSeat));
              this.loading = false;
              this.error = false;
            },
            error: error => {
              this.loading = false;
              this.error = true;
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  shouldOwnerBeDisabled(role: Role): boolean {
    return role === Role.Owner && (!this.amIOwner() || this.isSelectedOwner());
  }

  noRolesChanged(): boolean {
    if (this.loading) {
      return true;
    }
    const selectedRoles = this.seatDetailReply.selectedSeat?.roles;
    const updatedRoles = this.seatWithUpdates?.roles;

    if (!selectedRoles || !updatedRoles || selectedRoles.length !== updatedRoles.length) {
      return false; // Enable button if roles are not set or lengths differ
    }

    const selectedRolesSet = new Set(selectedRoles);
    const updatedRolesSet = new Set(updatedRoles);

    if (selectedRolesSet.size !== updatedRolesSet.size) {
      return false; // Enable button if the number of unique roles differs
    }

    for (const role of selectedRolesSet) {
      if (!updatedRolesSet.has(role)) {
        return false; // Enable button if any role differs
      }
    }

    return true; // Disable button if all roles match
  }

  disableButtonDelete(): boolean {
    return this.loading || !this.amIAdministrator() || this.isSelectedOwner();
  }

  isSelectedOwner(): boolean {
    return this.seatDetailReply?.selectedSeat?.roles.includes(Role.Owner);
  }

  amIOwner(): boolean {
    return this.seatDetailReply?.mySeat?.roles?.includes(Role.Owner);
  }

  amIAdministrator(): boolean {
    return this.seatDetailReply?.mySeat?.roles?.includes(Role.Administrator);
  }

  updateSeat(): void {
    if (this.noRolesChanged()) {
      this.snackBarService.info('Nothing to update.');
    }
    else {
      this.authService.waitForAuth().then(() => {
        let request: UpdateSeatDetailRequest = {
          seatUpdated: this.seatWithUpdates
        };
        this.seatDetailService.updateSeat(request)
          .subscribe(reply => {
            if (reply.seat) {
              this.snackBarService.info('User updated.');
              this.returnUrlService.openReturnURL('/dashboard');
            }
            else {
              this.snackBarService.error('Could not update user. Please try again later.');
            }
          });
      }).catch((error) => {
        this.logService.error("waitForAuth failed: " + error);
      });
    }
  }

  cancel(): void {
    this.returnUrlService.openReturnURL('/dashboard');
  }

  deleteSeat(seatToDelete: Seat): void {
    this.authService.waitForAuth().then(() => {

      const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');

      if (!subscriptionID) {
        this.logService.error('SeatsComponent.invite: subscriptionID is null');
        this.snackBarService.error('Currently not possible to delete a user. Please try again later.');
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        let removeSeatRequest: DeleteSeatRequest = {
          seatToDelete: seatToDelete
        };
        this.seatDetailService.deleteSeat(removeSeatRequest)
          .subscribe(removeSeatReply => {
            if (removeSeatReply?.success) {
              this.snackBarService.info(`Removed ${removeSeatReply?.deletedSeat.email}.`);
              this.returnUrlService.openReturnURL('/dashboard');
            }
            else {
              this.snackBarService.error(`Could not remove ${seatToDelete?.email}. Please rety.`);
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  handleKeyDown(event: KeyboardEvent, role: Role) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleRoleSelection(role);
    }
  }

}
