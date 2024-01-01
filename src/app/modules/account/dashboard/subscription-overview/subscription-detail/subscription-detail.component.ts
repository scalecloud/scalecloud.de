import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SubscriptionDetailService } from './subscription-detail.service';
import { ISubscriptionDetail } from './subscription-detail';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.scss']
})
export class SubscriptionDetailComponent implements OnInit {

  subscriptionDetail: ISubscriptionDetail | undefined;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private subscriptionDetailService: SubscriptionDetailService,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.reloadSubscriptionDetail();
  }

  reloadSubscriptionDetail(): void {
    this.authService.waitForAuth().then(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id == null) {
        this.logService.error('SubscriptionDetailComponent.getSubscriptionDetail: id is null');
      } else {
        this.subscriptionDetailService.getSubscriptionDetail(id)
          .subscribe(subscriptionDetail => this.subscriptionDetail = subscriptionDetail);
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
    });
  }

  isEnding(): boolean {
    let isEnding = false;
    if (this.subscriptionDetail) {
      isEnding = this.subscriptionDetail.cancel_at_period_end;
    }
    return isEnding;
  }
}
