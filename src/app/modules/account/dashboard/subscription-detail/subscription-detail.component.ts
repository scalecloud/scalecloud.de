import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { ISubscription } from '../subscription';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { LogService } from 'src/app/shared/services/log/log.service';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.scss']
})
export class SubscriptionDetailComponent implements OnInit {

  subscription: ISubscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private location: Location,
    private logService: LogService
  ) { }

  ngOnInit(): void {
    this.getSubscription();
  }

  getSubscription(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id == null) {
      this.logService.error('SubscriptionDetailComponent.getSubscription: id is null');
    } else {
      this.dashboardService.getSubscription(id)
        .subscribe(subscription => this.subscription = subscription);
    }
  }

  goBack(): void {
    this.location.back();
  }

}
