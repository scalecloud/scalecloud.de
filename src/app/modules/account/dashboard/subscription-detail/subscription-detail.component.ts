import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
    private location: Location,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getSubscriptionDetail();
      }
    }
    );
  }

  getSubscriptionDetail(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      this.logService.error('SubscriptionDetailComponent.getSubscriptionDetail: id is null');
    } else {
      this.subscriptionDetailService.getSubscriptionDetail(id)
        .subscribe(subscriptionDetail => this.subscriptionDetail = subscriptionDetail);
    }
  }

  goBack(): void {
    this.location.back();
  }

}