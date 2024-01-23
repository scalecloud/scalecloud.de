import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddSeatService } from '../add-seat/add-seat.service';
import { RemoveSeatRequest } from '../seats';
import { RemoveSeatService } from './remove-seat.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-remove-seat',
  templateUrl: './remove-seat.component.html',
  styleUrl: './remove-seat.component.scss'
})
export class RemoveSeatComponent {

  constructor(
    private authService: AuthService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private removeSeatService: RemoveSeatService,
    private returnUrlService: ReturnUrlService,
    private route: ActivatedRoute,
  ) { }

  removeSeat(email: string): void {
    this.authService.waitForAuth().then(() => {

      const subscriptionID = this.route.snapshot.paramMap.get('id');

      if (!subscriptionID) {
        this.logService.error('SeatsComponent.invite: subscriptionID is null');
        this.snackBarService.error('Currently not possible to invite a user. Please try again later.');
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        let removeSeatRequest: RemoveSeatRequest = {
          subscriptionID: subscriptionID,
          email: email
        };
        this.removeSeatService.removeSeat(removeSeatRequest)
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
