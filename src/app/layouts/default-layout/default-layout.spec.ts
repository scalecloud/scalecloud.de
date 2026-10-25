import { RouterModule, provideRouter, ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal, WritableSignal } from '@angular/core';

import { DefaultLayout } from './default-layout';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Auth } from 'src/app/core/auth/auth';
import { APP_BASE_URL, API_URL } from 'src/app/core/config/api-token';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';
import { Sidebar } from '../sidebar/sidebar';

// DefaultLayout imports Header, which depends on Auth. Provide the current facade
// signals so the header can render its resolved signed-out state.
describe('DefaultLayout', () => {
  let component: DefaultLayout;
  let fixture: ComponentFixture<DefaultLayout>;
  let loadingPermissions: WritableSignal<boolean>;

  const resolvedSignal = signal(true);
  const showAsLoggedInSignal = signal(false);
  const auth = {
    resolved: resolvedSignal,
    showAsLoggedIn: showAsLoggedInSignal,
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    resolvedSignal.set(true);
    showAsLoggedInSignal.set(false);
    loadingPermissions = signal(false);

    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatMenuModule,
        DefaultLayout,
        Sidebar,
        MatDivider,
        MatIcon,
        MatNavList,
        Footer,
        Header,
        MatMenu,
        MatToolbar,
        MatToolbarRow,
        RouterModule
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }
        },
        { provide: PermissionStore, useValue: { loadingPermissions } },
        { provide: APP_BASE_URL, useValue: 'http://localhost' },
        { provide: API_URL, useValue: 'http://localhost/api' },
        { provide: Auth, useValue: auth }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  it('starts with the desktop sidebar open and mobile sidebar closed', () => {
    expect(component.isDesktopSidebarOpen()).toBe(true);
    expect(component.isMobileSidebarOpen()).toBe(false);
    expect(component.isSidebarOpen()).toBe(true);
  });

  it('toggles the desktop sidebar', () => {
    component.sideBarToggler();
    expect(component.isSidebarOpen()).toBe(false);

    component.sideBarToggler();
    expect(component.isSidebarOpen()).toBe(true);
  });

  it('keeps the desktop drawer state in sync with Material', () => {
    component.sidebarOpenedChange(false);

    expect(component.isDesktopSidebarOpen()).toBe(false);
    expect(component.isSidebarOpen()).toBe(false);
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