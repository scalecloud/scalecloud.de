import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';

import { DefaultLayout } from './default-layout';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Auth } from 'src/app/core/auth/auth';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';

describe('DefaultLayout', () => {
  let component: DefaultLayout;
  let fixture: ComponentFixture<DefaultLayout>;
  let loadingPermissions: WritableSignal<boolean>;

  const resolvedSignal = signal(true);
  const showAsLoggedInSignal = signal(false);
  const auth = {
    resolved: resolvedSignal,
    showAsLoggedIn: showAsLoggedInSignal,
    user: signal(null),
    login: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    resolvedSignal.set(true);
    showAsLoggedInSignal.set(false);
    loadingPermissions = signal(false);

    await TestBed.configureTestingModule({
      imports: [DefaultLayout],
      providers: [
        provideRouter([]),
        { provide: PermissionStore, useValue: { loadingPermissions } },
        { provide: Auth, useValue: auth }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the public destinations in the mobile navigation', () => {
    const nav = fixture.nativeElement.querySelector('.mobile-bottom-nav') as HTMLElement;
    const labels = Array.from(nav.querySelectorAll('span')).map((label) => label.textContent);

    expect(labels).toEqual(['Home', 'Nextcloud', 'Synology']);
  });

  it('adds Dashboard to the mobile navigation for signed-in users', () => {
    showAsLoggedInSignal.set(true);
    fixture.detectChanges();

    const labels = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.mobile-bottom-nav span'),
    ).map((label) => label.textContent);

    expect(labels).toEqual(['Home', 'Nextcloud', 'Synology', 'Dashboard']);
  });

  it('renders the progress bar while permissions are loading', async () => {
    loadingPermissions.set(true);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeTruthy();
  });

  it('hides the progress bar once permissions finish loading', async () => {
    loadingPermissions.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeTruthy();

    loadingPermissions.set(false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeFalsy();
  });
});