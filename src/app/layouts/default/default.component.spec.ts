import { RouterModule, provideRouter, ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal, WritableSignal } from '@angular/core';

import { DefaultComponent } from './default.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { describe, beforeEach, it, expect } from 'vitest';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { API_URL, APP_BASE_URL } from 'src/app/core/config/api.token';

describe('DefaultComponent', () => {
  let component: DefaultComponent;
  let fixture: ComponentFixture<DefaultComponent>;
  let loadingPermissions: WritableSignal<boolean>;

  beforeEach(async () => {
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
        { provide: PermissionService, useValue: { loadingPermissions } },
        { provide: APP_BASE_URL, useValue: 'http://localhost' },
        { provide: API_URL, useValue: 'http://localhost/api' }
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
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeTruthy();
  });

  it('hides the progress bar once permissions finish loading', async () => {
    loadingPermissions.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeTruthy();

    loadingPermissions.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeFalsy();
  });
});