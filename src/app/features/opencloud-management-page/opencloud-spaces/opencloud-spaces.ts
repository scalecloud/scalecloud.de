import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  OpenCloudCreateSpaceRequest,
  OpenCloudPersonAllocation,
  OpenCloudSpaceAllocation,
} from '../opencloud-management-model';

interface SpaceUsageChart {
  line: string;
  area: string;
  lastX: number;
  lastY: number;
}

function createSpaceUsageChart(space: OpenCloudSpaceAllocation): SpaceUsageChart {
  const series = [...(space.dailyUsage ?? [])].sort((left, right) => left.date.localeCompare(right.date)).slice(-30);
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
  selector: 'app-opencloud-spaces',
  templateUrl: './opencloud-spaces.html',
  styleUrl: './opencloud-spaces.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton, MatIconButton, MatProgressBar, MatPaginator, DecimalPipe, MatFormField, MatLabel, MatSuffix, MatInput, MatOption, MatSelect],
})
export class OpenCloudSpaces {
  readonly spaces = input.required<OpenCloudSpaceAllocation[]>();
  readonly searchQuery = input('');
  readonly people = input.required<OpenCloudPersonAllocation[]>();
  readonly availableQuantity = input.required<number>();
  readonly storageAmount = input.required<number>();
  readonly storageUnit = input.required<string>();
  readonly busy = input(false);
  readonly showCreateForm = input(false);
  readonly create = output<Omit<OpenCloudCreateSpaceRequest, 'subscriptionID'>>();
  readonly quantityChange = output<{ spaceID: string; storageQuantity: number }>();
  readonly addMember = output<{ spaceID: string; uid: string }>();
  readonly removeMember = output<{ spaceID: string; permissionID: string }>();
  readonly name = signal('');
  readonly initialQuantity = signal(1);
  readonly pageSize = signal(25);
  readonly pageIndex = linkedSignal(() => {
    this.searchQuery();
    return 0;
  });
  readonly selectedMembers = signal<Record<string, string>>({});
  readonly filteredSpaces = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.spaces();
    return this.spaces().filter((space) =>
      space.name.toLowerCase().includes(query)
      || space.members.some((member) =>
        (member.displayName ?? '').toLowerCase().includes(query)
        || (member.email ?? '').toLowerCase().includes(query),
      ),
    );
  });
  readonly visibleSpaces = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredSpaces().slice(start, start + this.pageSize());
  });
  readonly usageCharts = computed(() => new Map(this.visibleSpaces().map((space) => [space.id, createSpaceUsageChart(space)])));

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  submitCreate(event: Event): void {
    event.preventDefault();
    const name = this.name().trim();
    if (!name || this.availableQuantity() < 1 || this.initialQuantity() < 1) return;
    this.create.emit({ name, storageQuantity: this.initialQuantity() });
    this.name.set('');
    this.initialQuantity.set(1);
  }

  setInitialQuantity(value: string): void {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      this.initialQuantity.set(Math.min(this.availableQuantity(), Math.max(1, Math.floor(parsed))));
    }
  }

  adjustSpace(space: OpenCloudSpaceAllocation, change: number): void {
    const next = space.storageQuantity + change;
    if (next < 1 || next > space.storageQuantity + this.availableQuantity()) return;
    this.quantityChange.emit({ spaceID: space.id, storageQuantity: next });
  }

  availablePeople(space: OpenCloudSpaceAllocation): OpenCloudPersonAllocation[] {
    const memberUIDs = new Set((space.members ?? []).map((member) => member.uid).filter(Boolean));
    return this.people().filter((person) => person.openCloudLinked && !memberUIDs.has(person.uid));
  }

  selectedMember(spaceID: string): string {
    return this.selectedMembers()[spaceID] ?? '';
  }

  setSelectedMember(spaceID: string, uid: string): void {
    this.selectedMembers.update((selected) => ({ ...selected, [spaceID]: uid }));
  }

  submitAddMember(event: Event, space: OpenCloudSpaceAllocation): void {
    event.preventDefault();
    const uid = this.selectedMember(space.id);
    if (!uid || this.busy()) return;
    this.addMember.emit({ spaceID: space.id, uid });
    this.selectedMembers.update((selected) => {
      const next = { ...selected };
      delete next[space.id];
      return next;
    });
  }

  usagePercent(space: OpenCloudSpaceAllocation): number {
    return space.storageQuantity > 0
      ? Math.min(100, Math.max(0, (space.usedQuantity ?? 0) / space.storageQuantity * 100))
      : 0;
  }
}