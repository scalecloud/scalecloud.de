import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { DashboardService } from './dashboard.service';
import { ISubscription } from './subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subscriptions: ISubscription[] = [];

  constructor(public authService: AuthService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.waitForAuth();
  }

  waitForAuth(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getSubscriptions();
      }
    }
    );
  }

  getSubscriptions(): void {
    if (this.subscriptions != null) {
      this.dashboardService.getSubscriptions().subscribe(
        subscriptions => this.subscriptions = subscriptions);
    }
  }

}
