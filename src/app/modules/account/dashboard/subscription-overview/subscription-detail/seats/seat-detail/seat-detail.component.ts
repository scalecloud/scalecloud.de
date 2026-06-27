import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
  computed,
  linkedSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Role, RoleDescriptions } from 'src/app/shared/roles/roles';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import {
  DeleteSeatRequest,
  Seat,
  SeatDetailReply,
  SeatDetailRequest,
  UpdateSeatDetailRequest,
} from '../seats';
import { SeatDetailService } from './seat-detail.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmOwnerTransferComponent } from './confirm-owner-transfer/confirm-owner-transfer.component';
import {
  MatCard,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatTooltip } from '@angular/material/tooltip';
import { MatLabel } from '@angular/material/form-field';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-seat-detail',
  templateUrl: './seat-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './seat-detail.component.scss',
  imports: [
    MatCard,
    MatProgressBar,
    MatCardTitle,
    MatIcon,
    MatCardSubtitle,
    NgxSkeletonLoaderComponent,
    MatTooltip,
    MatCardContent,
    MatLabel,
    MatChipListbox,
    FormsModule,
    ReactiveFormsModule,
    MatChipOption,
    MatButton,
  ],
})
export class SeatDetailComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly seatDetailService = inject(SeatDetailService);
  private readonly returnUrlService = inject(ReturnUrlService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  // ── State ─────────────────────────────────────────────────────────────────
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly seatDetailReply = signal<SeatDetailReply | null>(null);

  /**
   * Editable copy of the selected seat's roles.
   * `linkedSignal` resets automatically when `seatDetailReply` changes,
   * so navigating away and back always starts with a fresh copy.
   */
  readonly pendingRoles = linkedSignal<Role[]>(() =>
    structuredClone(this.seatDetailReply()?.selectedSeat?.roles ?? [])
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  readonly allRoles = Object.values(Role);
  readonly roleDescriptions = RoleDescriptions;

  readonly rolesChanged = computed(() => {
    const original = this.seatDetailReply()?.selectedSeat?.roles ?? [];
    const pending = this.pendingRoles();
    if (original.length !== pending.length) return true;
    const originalSet = new Set(original);
    return pending.some((r) => !originalSet.has(r));
  });

  readonly canUpdate = computed(() => !this.loading() && this.rolesChanged());

  readonly canDelete = computed(
    () => !this.loading() && this.amIAdministrator() && !this.isSelectedOwner()
  );

  readonly isOwnerToggleDisabled = computed(
    () => !this.amIOwner() || this.isSelectedOwner()
  );

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadSeatDetail();
  }

  // ── Role management ───────────────────────────────────────────────────────
  toggleRoleSelection(role: Role): void {
    const current = this.pendingRoles();
    const hasRole = current.includes(role);

    this.pendingRoles.set(
      hasRole ? current.filter((r) => r !== role) : [...current, role]
    );

    // If the Owner role was just added, confirm the transfer.
    if (role === Role.Owner && !hasRole) {
      this.confirmOwnerTransfer(role);
    }
  }

  private confirmOwnerTransfer(role: Role): void {
    const dialogRef = this.dialog.open(ConfirmOwnerTransferComponent, {
      data: { email: this.seatDetailReply()?.selectedSeat?.email },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        // Roll back — remove Owner from pending roles.
        this.pendingRoles.update((roles) => roles.filter((r) => r !== role));
      }
    });
  }

  shouldOwnerBeDisabled(role: Role): boolean {
    return role === Role.Owner && this.isOwnerToggleDisabled();
  }

  // ── Data loading ──────────────────────────────────────────────────────────
  loadSeatDetail(): void {
    this.authService.waitForAuth().then(() => {
      const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');
      const uid = this.route.snapshot.paramMap.get('uid');

      if (!subscriptionID) {
        this.logService.error('SeatDetailComponent: subscriptionID is null');
        this.error.set(true);
        return;
      }
      if (!uid) {
        this.logService.error('SeatDetailComponent: uid is null');
        this.error.set(true);
        return;
      }

      const request: SeatDetailRequest = { subscriptionID, uid };
      this.loading.set(true);

      this.seatDetailService.getSeat(request).subscribe({
        next: (reply) => {
          this.seatDetailReply.set(reply);
          this.loading.set(false);
          this.error.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
    }).catch((err) => {
      this.logService.error('waitForAuth failed: ' + err);
      this.error.set(true);
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  updateSeat(): void {
    if (!this.canUpdate()) {
      this.snackBarService.info('Nothing to update.');
      return;
    }

    const selectedSeat = this.seatDetailReply()?.selectedSeat;
    if (!selectedSeat) return;

    const request: UpdateSeatDetailRequest = {
      seatUpdated: { ...selectedSeat, roles: [...this.pendingRoles()] },
    };

    this.authService.waitForAuth().then(() => {
      this.seatDetailService.updateSeat(request).subscribe({
        next: (reply) => {
          if (reply.seat) {
            this.snackBarService.info('User updated.');
            this.returnUrlService.openReturnURL('/dashboard');
          } else {
            this.snackBarService.error('Could not update user. Please try again later.');
          }
        },
      });
    }).catch((err) => {
      this.logService.error('waitForAuth failed: ' + err);
    });
  }

  cancel(): void {
    this.returnUrlService.openReturnURL('/dashboard');
  }

  deleteSeat(seatToDelete: Seat): void {
    const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');

    if (!subscriptionID) {
      this.logService.error('SeatDetailComponent.deleteSeat: subscriptionID is null');
      this.snackBarService.error('Currently not possible to delete a user. Please try again later.');
      this.returnUrlService.openReturnURL('/dashboard');
      return;
    }

    const request: DeleteSeatRequest = { seatToDelete };

    this.authService.waitForAuth().then(() => {
      this.seatDetailService.deleteSeat(request).subscribe({
        next: (reply) => {
          if (reply?.success) {
            this.snackBarService.info(`Removed ${reply.deletedSeat.email}.`);
            this.returnUrlService.openReturnURL('/dashboard');
          } else {
            this.snackBarService.error(
              `Could not remove ${seatToDelete?.email}. Please retry.`
            );
          }
        },
      });
    }).catch((err) => {
      this.logService.error('waitForAuth failed: ' + err);
    });
  }

  // ── Keyboard accessibility ────────────────────────────────────────────────
  handleKeyDown(event: KeyboardEvent, role: Role): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleRoleSelection(role);
    }
  }

  // ── Seat helpers ──────────────────────────────────────────────────────────
  isSelectedOwner(): boolean {
    return this.seatDetailReply()?.selectedSeat?.roles.includes(Role.Owner) ?? false;
  }

  amIOwner(): boolean {
    return this.seatDetailReply()?.mySeat?.roles?.includes(Role.Owner) ?? false;
  }

  amIAdministrator(): boolean {
    return this.seatDetailReply()?.mySeat?.roles?.includes(Role.Administrator) ?? false;
  }
}