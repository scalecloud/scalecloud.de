import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { OpenCloudSpaceMembers } from '../opencloud-space-members/opencloud-space-members';
import { OpenCloudCreateSpaceRequest, OpenCloudSpaceAllocation } from '../opencloud-management-model';
import { OpenCloudAllocationHeader } from '../opencloud-allocation-header/opencloud-allocation-header';
import { OpenCloudStorageUsage } from '../opencloud-storage-usage/opencloud-storage-usage';

@Component({
  selector: 'app-opencloud-spaces',
  templateUrl: './opencloud-spaces.html',
  styleUrl: './opencloud-spaces.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton, MatIconButton, MatPaginator, MatFormField, MatLabel, MatSuffix, MatInput, OpenCloudSpaceMembers, OpenCloudAllocationHeader, OpenCloudStorageUsage],
})
export class OpenCloudSpaces {
  readonly spaces = input.required<OpenCloudSpaceAllocation[]>();
  readonly searchQuery = input('');
  readonly availableQuantity = input.required<number>();
  readonly storageAmount = input.required<number>();
  readonly storageUnit = input.required<string>();
  readonly busy = input(false);
  readonly showCreateForm = input(false);
  readonly create = output<Omit<OpenCloudCreateSpaceRequest, 'subscriptionID'>>();
  readonly quantityChange = output<{ spaceID: string; storageQuantity: number }>();
  readonly addMember = output<{ spaceID: string; email: string }>();
  readonly removeMember = output<{ spaceID: string; permissionID: string }>();
  readonly deleteSpace = output<{ spaceID: string }>();
  readonly name = signal('');
  readonly initialQuantity = signal(1);
  readonly pageSize = signal(25);
  readonly pageIndex = linkedSignal(() => {
    this.searchQuery();
    return 0;
  });
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

}