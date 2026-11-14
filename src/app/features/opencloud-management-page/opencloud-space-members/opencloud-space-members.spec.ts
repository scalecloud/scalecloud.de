import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenCloudSpaceMembers } from './opencloud-space-members';

describe('OpenCloudSpaceMembers', () => {
  let fixture: ComponentFixture<OpenCloudSpaceMembers>;
  let component: OpenCloudSpaceMembers;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OpenCloudSpaceMembers] }).compileComponents();
    fixture = TestBed.createComponent(OpenCloudSpaceMembers);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('space', {
      id: 'space-1',
      name: 'Design team',
      storageQuantity: 1,
      memberCount: 1,
      members: [{ permissionID: 'permission-1', uid: 'existing-person' }],
    });
    fixture.componentRef.setInput('people', []);
    fixture.detectChanges();
  });

  it('only offers linked people who are not already members', () => {
    fixture.componentRef.setInput('people', [
      { uid: 'existing-person', email: 'existing@example.com', roles: [], openCloudLinked: true, storageQuantity: 1, isOwner: false },
      { uid: 'new-person', email: 'new@example.com', roles: [], openCloudLinked: true, storageQuantity: 1, isOwner: false },
      { uid: 'unlinked-person', email: 'unlinked@example.com', roles: [], openCloudLinked: false, storageQuantity: 1, isOwner: false },
    ]);
    fixture.detectChanges();

    expect(component.availablePeople().map((person) => person.uid)).toEqual(['new-person']);
  });

  it('emits a member addition and clears the selected person', () => {
    const added = vi.fn();
    component.addMember.subscribe(added);
    component.selectedMember.set('new-person');
    const preventDefault = vi.fn();

    component.submitAddMember({ preventDefault } as unknown as Event);

    expect(preventDefault).toHaveBeenCalled();
    expect(added).toHaveBeenCalledWith({ spaceID: 'space-1', uid: 'new-person' });
    expect(component.selectedMember()).toBe('');
  });

  it('does not add a member while busy', () => {
    const added = vi.fn();
    component.addMember.subscribe(added);
    component.selectedMember.set('new-person');
    fixture.componentRef.setInput('busy', true);
    fixture.detectChanges();

    component.submitAddMember({ preventDefault: vi.fn() } as unknown as Event);

    expect(added).not.toHaveBeenCalled();
  });
});
