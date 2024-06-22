import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Role, RoleDescriptions } from 'src/app/shared/roles/roles';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { DeleteSeatRequest, Seat, SeatDetailReply, SeatDetailRequest } from '../seats';
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
    if (role === Role.Owner) {
      const dialogRef = this.dialog.open(ConfirmOwnerTransferComponent, {
        data: {
          message: 'Are you sure you want to transfer ownership to this user?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.addRole(role);
        }
      });
    } else {
      if (!this.seatWithUpdates.roles.includes(role)) {
        this.addRole(role);
      } else {
        this.removeRole(role);
      }
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
            next: reply => {
              this.seatDetailReply = reply;
              this.seatWithUpdates = JSON.parse(JSON.stringify(reply.selectedSeat));
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

  shouldOwnerBeDisabled(role: Role): boolean {
    return role === Role.Owner && (!this.amIOwner() || this.isSelectedOwner(role));
  }

  disableButtonUpdate(): boolean {
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
    return this.isSelectedOwner(Role.Owner) && this.amIAdministrator();
  }

  isSelectedOwner(role: Role): boolean {
    return this.seatDetailReply.selectedSeat?.roles.includes(Role.Owner);
  }

  amIOwner(): boolean {
    return this.seatDetailReply?.mySeat?.roles?.includes(Role.Owner);
  }

  amIAdministrator(): boolean {
    return this.seatDetailReply?.mySeat?.roles?.includes(Role.Administrator);
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
