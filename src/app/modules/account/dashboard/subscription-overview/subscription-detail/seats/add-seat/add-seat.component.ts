import { Component } from '@angular/core';
import { AddSeatRequest } from '../seats';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddSeatService } from './add-seat.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormControl, Validators } from '@angular/forms';
import { RoleDescriptions, Role } from 'src/app/shared/roles/roles';

@Component({
  selector: 'app-add-seat',
  templateUrl: './add-seat.component.html',
  styleUrl: './add-seat.component.scss'
})
export class AddSeatComponent {

  email = new UntypedFormControl('', [Validators.required, Validators.email]);

  // Exclude the Owner only while inviting users
  inviteUserRoles = Object.values(Role).filter(value => typeof value === 'string' && value !== Role[Role.Owner]);
  roleDescriptions = RoleDescriptions;
  Roles = Role;
  selectedRoles: Role[] = [];

  constructor(
    private authService: AuthService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private addSeatService: AddSeatService,
    private returnUrlService: ReturnUrlService,
    private route: ActivatedRoute,
  ) { }

  addSeat(): void {
    this.authService.waitForAuth().then(() => {

      if (this.isEmailInvalid()) {
        this.logService.warn("Invalid inputs in Login.");
      }

      const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');

      if (!subscriptionID) {
        this.logService.error('SeatsComponent.invite: subscriptionID is null');
        this.snackBarService.error('Currently not possible to invite a user. Please try again later.');
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        let addSeatRequest: AddSeatRequest = {
          subscriptionID: subscriptionID,
          email: this.email.value,
          roles: this.selectedRoles,
        };
        this.addSeatService.addSeat(addSeatRequest)
          .subscribe(addSeatReply => {
            if (addSeatReply.success) {
              this.snackBarService.info(`Invitation sent to ${addSeatReply?.email}.`);
              this.returnUrlService.openReturnURL('/dashboard');
            }
            else {
              this.snackBarService.error(`Could not send invitation to ${addSeatReply?.email}. Please rety.`);
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  isEmailInvalid(): boolean {
    return this.email.hasError('required') || this.email.hasError('email');
  }

  getErrorMessageEMail() {
    if (this.email.hasError('required')) {
      return 'You must enter a your E-Mail address';
    }

    return this.email.hasError('email') ? 'Not a valid E-Mail address' : '';
  }

  toggleRoleSelection(role: Role): void {
    const index = this.selectedRoles.indexOf(role);
    if (index === -1) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles.splice(index, 1);
    }
  }


}
