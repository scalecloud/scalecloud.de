import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddUserService } from '../add-user/add-user.service';
import { RemoveUserRequest } from '../users';
import { RemoveUserService } from './remove-user.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.scss'
})
export class RemoveUserComponent {

  constructor(
    private authService: AuthService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private removeUserService: RemoveUserService,
    private returnUrlService: ReturnUrlService,
    private route: ActivatedRoute,
  ) { }

  removeUser(email: string): void {
    this.authService.waitForAuth().then(() => {

      const subscriptionID = this.route.snapshot.paramMap.get('id');

      if (!subscriptionID) {
        this.logService.error('UsersComponent.invite: subscriptionID is null');
        this.snackBarService.error('Currently not possible to invite a user. Please try again later.');
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        let removeUserRequest: RemoveUserRequest = {
          subscriptionID: subscriptionID,
          email: email
        };
        this.removeUserService.removeUser(removeUserRequest)
          .subscribe(removeUserReply => {
            if (removeUserReply.success) {
              this.snackBarService.info(`Removed ${removeUserReply?.email}.`);
              this.returnUrlService.openReturnURL('/dashboard');
            }
            else {
              this.snackBarService.error(`Could not remove ${removeUserReply?.email}. Please rety.`);
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

}
