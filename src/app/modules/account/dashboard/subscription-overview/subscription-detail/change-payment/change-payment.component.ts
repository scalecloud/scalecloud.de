import { Component } from '@angular/core';
import { ISubscriptionDetail } from '../subscription-detail';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SubscriptionDetailService } from '../subscription-detail.service';

@Component({
  selector: 'app-change-payment',
  templateUrl: './change-payment.component.html',
  styleUrls: ['./change-payment.component.scss']
})
export class ChangePaymentComponent {

  subscriptionDetail: ISubscriptionDetail | undefined;
  
  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private subscriptionDetailService: SubscriptionDetailService,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.reloadSubscriptionDetail();
      }
    }
    );
  }

  reloadSubscriptionDetail(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      this.logService.error('SubscriptionDetailComponent.getSubscriptionDetail: id is null');
    } else {
      this.subscriptionDetailService.getSubscriptionDetail(id)
        .subscribe(subscriptionDetail => this.subscriptionDetail = subscriptionDetail);
    }
  }


}
