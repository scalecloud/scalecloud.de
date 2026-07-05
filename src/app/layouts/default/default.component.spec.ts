import { RouterModule, provideRouter, ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal, WritableSignal } from '@angular/core';

import { DefaultComponent } from './default.component';
import { SidebarComponent } from 'src/app/layouts/sidebar/sidebar.component';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Auth } from 'src/app/core/auth/auth';
import { APP_BASE_URL, API_URL } from 'src/app/core/config/api-token';
import { Permission } from 'src/app/core/permission/permission';

// DefaultComponent imports HeaderComponent, which injects Auth.
// Without a mock here, Angular's root injector constructs the real
// Auth -> real FirebaseService -> real getAnalytics(), which is what
// leaked the blocked happy-dom script load into this spec's run. Reusing the
// same mock shape as header.component.spec.ts rather than inventing a second one.
describe('DefaultComponent', () => {
  let component: DefaultComponent;
  let fixture: ComponentFixture<DefaultComponent>;
  let loadingPermissions: WritableSignal<boolean>;

  const userSignal = signal<any>(undefined);
  const auth = {
    user: userSignal,
    signOut: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    userSignal.set(undefined);
    loadingPermissions = signal(false);

    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatMenuModule,
        DefaultComponent,
        SidebarComponent,
        MatDivider,
        MatIcon,
        MatNavList,
        FooterComponent,
        HeaderComponent,
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
        { provide: Permission, useValue: { loadingPermissions } },
        { provide: APP_BASE_URL, useValue: 'http://localhost' },
        { provide: API_URL, useValue: 'http://localhost/api' },
        { provide: Auth, useValue: auth }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts expanded with no flyout showing', () => {
    expect(component.isExpanded()).toBe(true);
    expect(component.isShowing()).toBe(false);
  });

  it('toggles isExpanded each time sideBarToggler is called', () => {
    component.sideBarToggler();
    expect(component.isExpanded()).toBe(false);

    component.sideBarToggler();
    expect(component.isExpanded()).toBe(true);
  });

  it('clears isShowing when re-expanding the sidebar', () => {
    component.sideBarToggler(); // collapse
    component.mouseenter(); // flyout opens while collapsed
    expect(component.isShowing()).toBe(true);

    component.sideBarToggler(); // re-expand
    expect(component.isShowing()).toBe(false);
  });

  it('ignores mouseenter while the sidebar is expanded', () => {
    expect(component.isExpanded()).toBe(true);
    component.mouseenter();
    expect(component.isShowing()).toBe(false);
  });

  it('shows the flyout on mouseenter only while collapsed', () => {
    component.sideBarToggler(); // collapse
    component.mouseenter();
    expect(component.isShowing()).toBe(true);
  });

  it('hides the flyout on mouseleave while collapsed', () => {
    component.sideBarToggler(); // collapse
    component.mouseenter();
    expect(component.isShowing()).toBe(true);

    component.mouseleave();
    expect(component.isShowing()).toBe(false);
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