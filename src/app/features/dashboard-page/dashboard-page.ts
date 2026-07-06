import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';
import { ServiceStatus } from 'src/app/shared/client-status';
import { LastCountService } from './subscription-overview/last-count/last-count.service';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { SubscriptionOverviewComponent } from './subscription-overview/subscription-overview.component';
import { LoadingFailed } from '../../shared/loading-failed/loading-failed';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatProgressBar,
    MatCardTitle,
    NgxSkeletonLoaderComponent,
    MatCardSubtitle,
    MatDivider,
    MatCardContent,
    MatList,
    MatListItem,
    SubscriptionOverviewComponent,
    LoadingFailed,
  ],
})
export class DashboardPage implements OnInit {
  private readonly auth = inject(Auth);
  private readonly subscriptionOverviewService = inject(SubscriptionOverviewService);
  private readonly log = inject(Log);
  private readonly lastCountService = inject(LastCountService);

  readonly ServiceStatus = ServiceStatus;
  readonly reply = signal<ISubscriptionOverview[]>([]);
  readonly serviceStatus = signal<ServiceStatus>(ServiceStatus.Initializing);
  readonly skeletonItems = computed(() =>
    Array.from({ length: this.lastCountService.getLastSubscriptionOverviewCount })
  );

  ngOnInit(): void {
    this.loadSubscriptionsOverview();
  }

  private loadSubscriptionsOverview(): void {
    this.serviceStatus.set(ServiceStatus.Loading);

    this.auth
      .waitForAuth()
      .then(() => {
        this.subscriptionOverviewService.getSubscriptionsOverview().subscribe({
          next: (subscriptionsOverview) => {
            this.reply.set(subscriptionsOverview);
            this.lastCountService.setLastSubscriptionOverviewCount = subscriptionsOverview.length;
            this.serviceStatus.set(ServiceStatus.Success);
          },
          error: (error) => {
            this.serviceStatus.set(ServiceStatus.Error);
            this.log.error(`getSubscriptionsOverview failed: ${error}`);
          },
        });
      })
      .catch((error) => {
        this.log.error(`waitForAuth failed: ${error}`);
        this.serviceStatus.set(ServiceStatus.Error);
      });
  }
}