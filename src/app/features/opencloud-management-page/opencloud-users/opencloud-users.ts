import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Role, RoleDescriptions } from 'src/app/core/permission-store/roles';
import { AvatarColors, avatarColorsForUid } from 'src/app/shared/avatar-colors';
import { OpenCloudInviteUserRequest, OpenCloudPersonAllocation } from '../opencloud-management-model';

interface PersonUsageChart {
  line: string;
  area: string;
  lastX: number;
  lastY: number;
}

function createPersonUsageChart(user: OpenCloudPersonAllocation): PersonUsageChart {
  const series = [...(user.dailyUsage ?? [])].sort((left, right) => left.date.localeCompare(right.date)).slice(-30);
  if (series.length === 0) return { line: '', area: '', lastX: 0, lastY: 0 };

  const max = Math.max(...series.map((point) => point.usedQuantity), 0.01) * 1.12;
  const coordinates = series.map((point, index) => {
    const x = series.length === 1 ? 300 : index / (series.length - 1) * 300;
    const y = 40 - point.usedQuantity / max * 34;
    return [x, y] as const;
  });
  const line = coordinates
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  const [lastX, lastY] = coordinates.at(-1) ?? [0, 0];
  return { line, area: `${line} L300,48 L0,48 Z`, lastX, lastY };
}

@Component({
  selector: 'app-opencloud-users',
  templateUrl: './opencloud-users.html',
  styleUrl: './opencloud-users.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton, MatProgressBar, MatPaginator, DecimalPipe, MatChipListbox, MatChipOption, MatTooltip, MatFormField, MatLabel, MatSuffix, MatInput],
})
export class OpenCloudUsers {
  readonly users = input.required<OpenCloudPersonAllocation[]>();
  readonly searchQuery = input('');
  readonly availableQuantity = input.required<number>();
  readonly storageAmount = input.required<number>();
  readonly storageUnit = input.required<string>();
  readonly busy = input(false);
  readonly showInviteForm = input(false);
  readonly invite = output<Omit<OpenCloudInviteUserRequest, 'subscriptionID'>>();
  readonly quantityChange = output<{ uid: string; storageQuantity: number; isOwner: boolean }>();
  readonly rolesChange = output<{ uid: string; roles: string[] }>();
  readonly email = signal('');
  readonly inviteQuantity = signal(1);
  readonly pageSize = signal(25);
  readonly pageIndex = linkedSignal(() => {
    this.searchQuery();
    return 0;
  });
  readonly editableRoles = [Role.Administrator, Role.User, Role.Billing];
  readonly roleDescriptions = RoleDescriptions;
  readonly pendingRoles = linkedSignal<Record<string, string[]>>(() =>
    Object.fromEntries(this.users().map((user) => [user.uid, [...user.roles]])),
  );
  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.users();
    return this.users().filter((user) =>
      user.email.toLowerCase().includes(query)
      || user.roles.some((role) => role.toLowerCase().includes(query)),
    );
  });
  readonly visibleUsers = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });
  readonly usageCharts = computed(() => new Map(this.visibleUsers().map((user) => [user.uid, createPersonUsageChart(user)])));

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  submitInvite(event: Event): void {
    event.preventDefault();
    const email = this.email().trim();
    if (!email || this.availableQuantity() < 1 || this.inviteQuantity() < 1) return;
    this.invite.emit({ email, storageQuantity: this.inviteQuantity() });
    this.email.set('');
    this.inviteQuantity.set(1);
  }

  setInviteQuantity(value: string): void {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      this.inviteQuantity.set(Math.min(this.availableQuantity(), Math.max(1, Math.floor(parsed))));
    }
  }

  adjustUser(user: OpenCloudPersonAllocation, change: number): void {
    const next = user.storageQuantity + change;
    if (next < 1 || next > user.storageQuantity + this.availableQuantity()) return;
    this.quantityChange.emit({ uid: user.uid, storageQuantity: next, isOwner: user.isOwner });
  }

  assignFirstUnit(user: OpenCloudPersonAllocation): void {
    if (user.storageQuantity === 0 && this.availableQuantity() >= 1) {
      this.quantityChange.emit({ uid: user.uid, storageQuantity: 1, isOwner: user.isOwner });
    }
  }

  roleOptions(user: OpenCloudPersonAllocation): string[] {
    return user.isOwner ? user.roles : this.editableRoles;
  }

  selectedRoles(user: OpenCloudPersonAllocation): string[] {
    return this.pendingRoles()[user.uid] ?? user.roles;
  }

  roleOptionDisabled(user: OpenCloudPersonAllocation, role: string): boolean {
    if (this.busy() || user.isOwner) return true;
    const selected = this.selectedRoles(user);
    return selected.length === 1 && selected[0] === role;
  }

  setRoleSelected(user: OpenCloudPersonAllocation, role: string, selected: boolean): void {
    if (user.isOwner || !this.editableRoles.includes(role as Role) || this.busy()) return;
    const current = this.selectedRoles(user);
    const next = selected
      ? [...new Set([...current, role])]
      : current.filter((currentRole) => currentRole !== role);
    if (next.length === 0) return;
    this.pendingRoles.update((roles) => ({ ...roles, [user.uid]: next }));
  }

  rolesChanged(user: OpenCloudPersonAllocation): boolean {
    const original = user.roles;
    const selected = this.selectedRoles(user);
    return original.length !== selected.length || selected.some((role) => !original.includes(role));
  }

  saveRoles(user: OpenCloudPersonAllocation): void {
    if (user.isOwner || !this.rolesChanged(user) || this.busy()) return;
    this.rolesChange.emit({ uid: user.uid, roles: [...this.selectedRoles(user)] });
  }

  cancelRoleChanges(user: OpenCloudPersonAllocation): void {
    this.pendingRoles.update((roles) => ({ ...roles, [user.uid]: [...user.roles] }));
  }

  roleDescription(role: string): string {
    return this.roleDescriptions[role as Role] ?? '';
  }

  initial(email: string): string {
    const identity = email.trim().split('@')[0] ?? '';
    const parts = identity.split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return '?';
    return parts.length > 1
      ? `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }

  avatarColors(uid: string): AvatarColors {
    return avatarColorsForUid(uid);
  }

  roleLabel(role: string): string {
    switch (role.toLowerCase()) {
      case 'owner': return 'Owner';
      case 'administrator': return 'Admin';
      case 'billing': return 'Billing';
      default: return 'User';
    }
  }

  usagePercent(user: OpenCloudPersonAllocation): number {
    return user.storageQuantity > 0
      ? Math.min(100, Math.max(0, (user.usedQuantity ?? 0) / user.storageQuantity * 100))
      : 0;
  }
}