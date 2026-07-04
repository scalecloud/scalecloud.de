import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ISubscriptionOverview } from './subscription-overview/subscription-overview';
import { SubscriptionOverviewService } from './subscription-overview/subscription-overview.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { LastCountService } from './subscription-overview/LastCount/last-count.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { SubscriptionOverviewComponent } from './subscription-overview/subscription-overview.component';
import { LoadingFailedComponent } from '../../../shared/components/loading-failed/loading-failed.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
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
    LoadingFailedComponent,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly subscriptionOverviewService = inject(SubscriptionOverviewService);
  private readonly logService = inject(LogService);
  private readonly lastCountService = inject(LastCountService);
  private readonly snackBarService = inject(SnackBarService);

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

    this.authService
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
            this.logService.error(`getSubscriptionsOverview failed: ${error}`);
          },
        });
      })
      .catch((error) => {
        this.logService.error(`waitForAuth failed: ${error}`);
        this.serviceStatus.set(ServiceStatus.Error);
      });
  }
}