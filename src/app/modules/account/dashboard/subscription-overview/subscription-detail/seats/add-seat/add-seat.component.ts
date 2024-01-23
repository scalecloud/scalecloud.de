import { Component } from '@angular/core';
import { AddSeatRequest } from '../seats';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddSeatService } from './add-seat.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-seat',
  templateUrl: './add-seat.component.html',
  styleUrl: './add-seat.component.scss'
})
export class AddSeatComponent {
  
  constructor(
    private authService: AuthService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private addSeatService: AddSeatService,
    private returnUrlService: ReturnUrlService,
    private route: ActivatedRoute,
  ) { }
 
  addSeat( email: string ): void {
    this.authService.waitForAuth().then(() => {

      const subscriptionID = this.route.snapshot.paramMap.get('id');

      if (!subscriptionID) {
        this.logService.error('SeatsComponent.invite: subscriptionID is null');
        this.snackBarService.error('Currently not possible to invite a user. Please try again later.');
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        let addSeatRequest: AddSeatRequest = {
          subscriptionID: subscriptionID,
          email: email
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


}
