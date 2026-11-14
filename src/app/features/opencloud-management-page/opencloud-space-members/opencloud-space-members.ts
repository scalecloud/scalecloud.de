import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OpenCloudPersonAllocation, OpenCloudSpaceAllocation } from '../opencloud-management-model';

@Component({
  selector: 'app-opencloud-space-members',
  templateUrl: './opencloud-space-members.html',
  styleUrl: './opencloud-space-members.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIconButton, MatIcon, MatFormField, MatLabel, MatOption, MatSelect, MatPaginator],
})
export class OpenCloudSpaceMembers {
  readonly space = input.required<OpenCloudSpaceAllocation>();
  readonly people = input.required<OpenCloudPersonAllocation[]>();
  readonly busy = input(false);
  readonly addMember = output<{ spaceID: string; uid: string }>();
  readonly removeMember = output<{ spaceID: string; permissionID: string }>();
  readonly selectedMember = signal('');
  readonly pageSize = signal(5);
  readonly pageIndex = linkedSignal(() => {
    this.space().members;
    return 0;
  });
  readonly availablePeople = computed(() => {
    const memberUIDs = new Set(
      this.space().members
        .map((member) => member.uid)
        .filter((uid): uid is string => Boolean(uid)),
    );
    return this.people().filter((person) => person.openCloudLinked && !memberUIDs.has(person.uid));
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
    const uid = this.selectedMember();
    if (!uid || this.busy()) return;
    this.addMember.emit({ spaceID: this.space().id, uid });
    this.selectedMember.set('');
  }
}
