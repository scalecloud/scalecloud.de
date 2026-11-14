import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OpenCloudSpaceAllocation } from '../opencloud-management-model';

@Component({
  selector: 'app-opencloud-space-members',
  templateUrl: './opencloud-space-members.html',
  styleUrl: './opencloud-space-members.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon, MatFormField, MatHint, MatLabel, MatInput, MatPaginator],
})
export class OpenCloudSpaceMembers {
  readonly space = input.required<OpenCloudSpaceAllocation>();
  readonly busy = input(false);
  readonly addMember = output<{ spaceID: string; email: string }>();
  readonly removeMember = output<{ spaceID: string; permissionID: string }>();
  readonly email = signal('');
  readonly pageSize = signal(5);
  readonly pageIndex = linkedSignal({
    source: () => this.space().members,
    computation: () => 0,
  });
  readonly visibleMembers = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.space().members.slice(start, start + this.pageSize());
  });

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  submitAddMember(event: Event): void {
    event.preventDefault();
    const email = this.email().trim();
    if (this.busy() || !email) return;
    this.addMember.emit({ spaceID: this.space().id, email });
    this.email.set('');
  }
}
