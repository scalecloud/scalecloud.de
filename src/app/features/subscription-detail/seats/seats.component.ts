import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { SeatsService } from './seats.service';
import { ListSeatReply, ListSeatRequest, Seat } from './seats';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ServiceStatus } from 'src/app/shared/service-status';
import { ActivatedRoute } from '@angular/router';
import {
  MatCard,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LoadingFailedComponent } from '../../../shared/loading-failed/loading-failed.component';
import { Auth } from 'src/app/core/auth/auth';
import { Permission } from 'src/app/core/permission/permission';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatProgressBar,
    MatCardTitle,
    MatIcon,
    MatCardSubtitle,
    NgxSkeletonLoaderComponent,
    MatDivider,
    MatCardContent,
    MatList,
    MatCardActions,
    MatButton,
    MatListItem,
    MatTooltip,
    MatPaginator,
    LoadingFailedComponent,
  ],
})
export class SeatsComponent implements OnInit {
  private readonly auth = inject(Auth);
  private readonly seatService = inject(SeatsService);
  private readonly log = inject(Log);
  private readonly snackBarService = inject(SnackBarService);
  private readonly returnUrl = inject(ReturnUrl);
  private readonly permission = inject(Permission);
  private readonly route = inject(ActivatedRoute);

  readonly ServiceStatus = ServiceStatus;

  // ── State ────────────────────────────────────────────────────────────────
  readonly serviceStatus = signal<ServiceStatus>(ServiceStatus.Initializing);
  readonly seatListReply = signal<ListSeatReply | null>(null);

  readonly pageSize = 5;
  readonly pageIndex = signal(0);

  readonly hidePageSize = true;
  readonly showFirstLastButtons = false;

  // ── Derived ──────────────────────────────────────────────────────────────
  readonly usedSeats = computed(() => this.seatListReply()?.totalResults ?? 0);
  readonly maxSeats = computed(() => this.seatListReply()?.maxSeats ?? 0);
  readonly isAddSeatPossible = computed(
    () => (this.seatListReply()?.seats?.length ?? 0) < this.maxSeats()
  );

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.checkPermissions();
  }

  // ── Data loading ─────────────────────────────────────────────────────────
  async checkPermissions(): Promise<void> {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.log.error('SeatsComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    try {
      const hasPermission = await this.permission.isAdministrator(subscriptionID);
      if (hasPermission) {
        this.loadSeats();
      } else {
        this.serviceStatus.set(ServiceStatus.NoPermission);
      }
    } catch {
      this.serviceStatus.set(ServiceStatus.Error);
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  loadSeats(): void {
    this.serviceStatus.set(ServiceStatus.Loading);

    this.auth.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (!subscriptionID) {
        this.log.error('SeatsComponent.loadSeats: subscriptionID is null');
        this.serviceStatus.set(ServiceStatus.Error);
        return;
      }

      const request: ListSeatRequest = {
        subscriptionID,
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize,
      };

      this.seatService.getListSeats(request).subscribe({
        next: (reply) => {
          this.seatListReply.set(reply);
          this.serviceStatus.set(ServiceStatus.Success);
        },
        error: () => {
          this.serviceStatus.set(ServiceStatus.Error);
        },
      });
    }).catch((error) => {
      this.log.error('waitForAuth failed: ' + error);
      this.serviceStatus.set(ServiceStatus.Error);
    });
  }

  // ── Events ────────────────────────────────────────────────────────────────
  handlePageEvent(e: PageEvent): void {
    this.pageIndex.set(e.pageIndex);
    this.loadSeats();
  }

  addSeat(): void {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.snackBarService.error('Could not add seat. Please try again later.');
      return;
    }
    this.returnUrl.openUrlAddReturnUrl(
      `/dashboard/subscription/${subscriptionID}/add-seat`
    );
  }

  openSeatDetail(seat: Seat): void {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.snackBarService.error('Could not open seat detail. Please try again later.');
      return;
    }
    this.returnUrl.openUrlAddReturnUrl(
      `/dashboard/subscription/${subscriptionID}/${seat.uid}/seat-detail`
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') ?? '';
  }
}