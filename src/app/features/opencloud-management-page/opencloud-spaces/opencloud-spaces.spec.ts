import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenCloudSpaces } from './opencloud-spaces';

describe('OpenCloudSpaces', () => {
  let fixture: ComponentFixture<OpenCloudSpaces>;
  let component: OpenCloudSpaces;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OpenCloudSpaces] }).compileComponents();
    fixture = TestBed.createComponent(OpenCloudSpaces);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('spaces', []);
    fixture.componentRef.setInput('people', []);
    fixture.componentRef.setInput('availableQuantity', 3);
    fixture.componentRef.setInput('storageAmount', 1);
    fixture.componentRef.setInput('storageUnit', 'TB');
    fixture.detectChanges();
  });

  it('creates a space with its initial storage allocation', () => {
    const created = vi.fn();
    component.create.subscribe(created);
    component.name.set('Design team');
    component.initialQuantity.set(2);

    component.submitCreate({ preventDefault: vi.fn() } as unknown as Event);

    expect(created).toHaveBeenCalledWith({ name: 'Design team', storageQuantity: 2 });
  });

  it('does not create a space when no quantity is available', () => {
    const created = vi.fn();
    component.create.subscribe(created);
    component.name.set('Design team');
    fixture.componentRef.setInput('availableQuantity', 0);

    component.submitCreate({ preventDefault: vi.fn() } as unknown as Event);

    expect(created).not.toHaveBeenCalled();
  });

  it('renders the space usage and allocation clearly', () => {
    fixture.componentRef.setInput('spaces', [{
      id: 'space-1',
      name: 'Design team',
      memberCount: 3,
      storageQuantity: 2,
      usedQuantity: 0.5,
      members: [],
      dailyUsage: [
        { date: '2026-10-01', usedQuantity: 0.4 },
        { date: '2026-10-02', usedQuantity: 0.5 },
      ],
    }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Used 0.50 of 2.00 TB');
    expect(fixture.nativeElement.textContent).not.toContain('Allocated');
    expect(fixture.nativeElement.querySelector('.space-heading .allocation-control')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')?.getAttribute('aria-valuenow')).toBe('25');
    expect(fixture.nativeElement.querySelector('svg[role="img"]')?.getAttribute('aria-label'))
      .toBe('30-day storage usage for Design team');
  });

  it('adds available linked people and removes listed members', () => {
    const space = {
      id: 'space-1',
      name: 'Design team',
      memberCount: 1,
      storageQuantity: 2,
      members: [{
        permissionID: 'permission-1',
        uid: 'person-1',
        userID: 'cloud-user-1',
        displayName: 'Existing member',
        email: 'existing@example.com',
      }],
    };
    const person = {
      uid: 'person-2',
      email: 'new@example.com',
      roles: ['User'],
      openCloudLinked: true,
      storageQuantity: 1,
      isOwner: false,
    };
    const added = vi.fn();
    const removed = vi.fn();
    component.addMember.subscribe(added);
    component.removeMember.subscribe(removed);
    fixture.componentRef.setInput('spaces', [space]);
    fixture.componentRef.setInput('people', [person]);
    fixture.detectChanges();

    const details = fixture.nativeElement.querySelector('details') as HTMLDetailsElement;
    details.open = true;
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.remove-member') as HTMLButtonElement).click();
    component.setSelectedMember(space.id, person.uid);
    component.submitAddMember({ preventDefault: vi.fn() } as unknown as Event, space);

    expect(removed).toHaveBeenCalledWith({ spaceID: 'space-1', permissionID: 'permission-1' });
    expect(added).toHaveBeenCalledWith({ spaceID: 'space-1', uid: 'person-2' });
  });

  it('filters spaces and paginates the matching results', () => {
    fixture.componentRef.setInput('spaces', Array.from({ length: 30 }, (_, index) => ({
      id: `space-${index}`,
      name: `Team ${index}`,
      memberCount: 0,
      storageQuantity: 1,
      members: [],
    })));
    fixture.detectChanges();

    expect(component.visibleSpaces()).toHaveLength(25);
    component.onPageChange({ pageIndex: 1, pageSize: 25, length: 30 });
    expect(component.visibleSpaces()).toHaveLength(5);

    fixture.componentRef.setInput('searchQuery', 'TEAM 2');
    fixture.detectChanges();
    expect(component.filteredSpaces()).toHaveLength(11);
    expect(component.pageIndex()).toBe(0);
  });
});