import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { UsersService } from './users.service';
import { ListUserReply, ListUserRequest } from './users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  @Input() subscriptionID: string | undefined;
  userListReply: ListUserReply | undefined;

  constructor(
    public authService: AuthService,
    private userService: UsersService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
  ) { }


  ngOnInit(): void {
    this.initUsersList();
  }

  initUsersList(): void {
    this.authService.waitForAuth().then(() => {

      if (!this.subscriptionID) {
        this.logService.error('UsersComponent.initUsersList: subscriptionID is null');
      } else {
        let userListRequest: ListUserRequest = {
          subscriptionID: this.subscriptionID
        };
        this.userService.getListUsers(userListRequest)
          .subscribe(userListReply => this.userListReply = userListReply);
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  getCurrentUsers(): number {
    return this.userListReply?.emails?.length || 0;
  }

  getMaxUsers(): number {
    return this.userListReply?.max_users || 0;
  }

  isAddUserPossible(): boolean {
    return this.userListReply?.emails?.length < this.userListReply?.max_users;
  }

  addUser(): void {
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/subscription/' + this.subscriptionID + '/add-user');
  }

}
