import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ListSeatReply, ListSeatRequest, Seat } from './seats-model';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ServiceStatus } from 'src/app/shared/client-status';
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
import { LoadingFailed } from '../../../shared/loading-failed/loading-failed';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';
import { SeatsClient } from './seats-client';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.html',
  styleUrls: ['./seats.scss'],
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
    LoadingFailed,
  ],
})
export class Seats implements OnInit {
  private readonly auth = inject(Auth);
  private readonly seatsClient = inject(SeatsClient);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);
  private readonly returnUrl = inject(ReturnUrl);
  private readonly permissionStore = inject(PermissionStore);
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
      const hasPermission = await this.permissionStore.isAdministrator(subscriptionID);
      if (hasPermission) {
        this.loadSeats();
      } else {
        this.serviceStatus.set(ServiceStatus.NoPermission);
      }
    } catch {
      this.serviceStatus.set(ServiceStatus.Error);
      this.snackBar.error('An error occurred while checking permissions.');
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

      this.seatsClient.getListSeats(request).subscribe({
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
      this.snackBar.error('Could not add seat. Please try again later.');
      return;
    }
    this.returnUrl.openUrlAddReturnUrl(
      `/dashboard/subscription/${subscriptionID}/add-seat`
    );
  }

  openSeatDetail(seat: Seat): void {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.snackBar.error('Could not open seat detail. Please try again later.');
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