import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { avatarColorsForUid } from 'src/app/shared/avatar-colors';
import { OpenCloudUsers } from './opencloud-users';

describe('OpenCloudUsers', () => {
  let fixture: ComponentFixture<OpenCloudUsers>;
  let component: OpenCloudUsers;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OpenCloudUsers] }).compileComponents();
    fixture = TestBed.createComponent(OpenCloudUsers);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('users', []);
    fixture.componentRef.setInput('availableQuantity', 4);
    fixture.componentRef.setInput('storageAmount', 1);
    fixture.componentRef.setInput('storageUnit', 'TB');
    fixture.detectChanges();
  });

  it('emits an invitation with at least one unit of storage', () => {
    const invited = vi.fn();
    component.invite.subscribe(invited);
    component.email.set('new@example.com');
    component.inviteQuantity.set(2);

    component.submitInvite({ preventDefault: vi.fn() } as unknown as Event);

    expect(invited).toHaveBeenCalledWith({ email: 'new@example.com', storageQuantity: 2 });
  });

  it('does not invite a person when no quantity is available', () => {
    const invited = vi.fn();
    component.invite.subscribe(invited);
    component.email.set('new@example.com');
    fixture.componentRef.setInput('availableQuantity', 0);

    component.submitInvite({ preventDefault: vi.fn() } as unknown as Event);

    expect(invited).not.toHaveBeenCalled();
  });

  it('does not decrement an assigned user below one unit', () => {
    const changed = vi.fn();
    component.quantityChange.subscribe(changed);

    component.adjustUser({ uid: 'user-1', email: 'user@example.com', roles: ['User'], openCloudLinked: true, storageQuantity: 1, isOwner: false }, -1);

    expect(changed).not.toHaveBeenCalled();
  });

  it('uses the same two-letter initials as the account header', () => {
    expect(component.initial('sembeth@example.com')).toBe('SE');
    expect(component.initial('mary.jane@example.com')).toBe('MJ');
  });

  it('uses the shared UID-based avatar palette', () => {
    expect(component.avatarColors('authentik-user-1')).toEqual(avatarColorsForUid('authentik-user-1'));
  });

  it('renders a 30-day usage graph for a person with history', () => {
    fixture.componentRef.setInput('users', [{
      uid: 'user-1',
      email: 'user@example.com',
      roles: ['User'],
      openCloudLinked: true,
      storageQuantity: 2,
      usedQuantity: 0.5,
      dailyUsage: [
        { date: '2026-10-01', usedQuantity: 0.4 },
        { date: '2026-10-02', usedQuantity: 0.5 },
      ],
      isOwner: false,
    }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('30-day usage');
    expect(fixture.nativeElement.querySelector('svg[role="img"]')?.getAttribute('aria-label'))
      .toBe('30-day storage usage for user@example.com');
  });

  it('does not show decimal places for whole-number storage allocations', () => {
    fixture.componentRef.setInput('users', [{
      uid: 'user-1',
      email: 'user@example.com',
      roles: ['User'],
      openCloudLinked: true,
      storageQuantity: 2,
      isOwner: false,
    }]);
    fixture.detectChanges();

    const allocation = fixture.nativeElement.querySelector('.allocation-control input') as HTMLInputElement;
    expect(allocation.value).toBe('2');
    expect(fixture.nativeElement.textContent).toContain('Used 0 of 2 TB');
    expect(fixture.nativeElement.querySelector('.usage-actions strong')?.textContent?.trim()).toBe('0 %');
  });

  it('stages role changes and emits them when saved', () => {
    const user = {
      uid: 'user-1', email: 'user@example.com', roles: ['User'], openCloudLinked: true,
      storageQuantity: 1, isOwner: false,
    };
    const rolesChanged = vi.fn();
    component.rolesChange.subscribe(rolesChanged);

    component.setRoleSelected(user, 'Billing', true);
    expect(component.rolesChanged(user)).toBe(true);
    component.saveRoles(user);

    expect(rolesChanged).toHaveBeenCalledWith({ uid: 'user-1', roles: ['User', 'Billing'] });
  });

  it('filters people and paginates the matching results', () => {
    fixture.componentRef.setInput('users', Array.from({ length: 30 }, (_, index) => ({
      uid: `user-${index}`,
      email: `person-${index}@example.com`,
      roles: ['User'],
      openCloudLinked: true,
      storageQuantity: 1,
      isOwner: false,
    })));
    fixture.detectChanges();

    expect(component.visibleUsers()).toHaveLength(25);
    component.onPageChange({ pageIndex: 1, pageSize: 25, length: 30 });
    expect(component.visibleUsers()).toHaveLength(5);

    fixture.componentRef.setInput('searchQuery', 'PERSON-2');
    fixture.detectChanges();
    expect(component.filteredUsers()).toHaveLength(11);
    expect(component.pageIndex()).toBe(0);
  });
});