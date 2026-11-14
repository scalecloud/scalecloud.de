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
    fixture.detectChanges();
  });

  it('adds an existing OpenCloud user by email', () => {
    const added = vi.fn();
    component.addMember.subscribe(added);
    component.email.set(' new@example.com ');
    const preventDefault = vi.fn();

    component.submitAddMember({ preventDefault } as unknown as Event);

    expect(preventDefault).toHaveBeenCalled();
    expect(added).toHaveBeenCalledWith({ spaceID: 'space-1', email: 'new@example.com' });
    expect(component.email()).toBe('');
  });

  it('does not add a member while busy', () => {
    const added = vi.fn();
    component.addMember.subscribe(added);
    component.email.set('new@example.com');
    fixture.componentRef.setInput('busy', true);
    fixture.detectChanges();

    component.submitAddMember({ preventDefault: vi.fn() } as unknown as Event);

    expect(added).not.toHaveBeenCalled();
  });

  it('does not add an empty email', () => {
    const added = vi.fn();
    component.addMember.subscribe(added);

    component.submitAddMember({ preventDefault: vi.fn() } as unknown as Event);

    expect(added).not.toHaveBeenCalled();
  });

  it('paginates long member lists', () => {
    fixture.componentRef.setInput('space', {
      id: 'space-1',
      name: 'Design team',
      storageQuantity: 1,
      memberCount: 12,
      members: Array.from({ length: 12 }, (_, index) => ({
        permissionID: `permission-${index}`,
        displayName: `Member ${index}`,
      })),
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.member-row')).toHaveLength(5);
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 12 });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.member-row')).toHaveLength(5);
    expect(fixture.nativeElement.querySelector('.member-info strong')?.textContent).toBe('Member 5');
  });
});
