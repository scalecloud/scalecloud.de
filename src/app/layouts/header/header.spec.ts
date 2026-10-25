import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { Header } from './header';
import { Auth, AuthUser } from 'src/app/core/auth/auth';
import { environment } from 'src/environments/environment';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findButton(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.includes(text));
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;

  const resolved = signal(false);
  const showAsLoggedIn = signal(false);
  const user = signal<AuthUser | null>(null);
  const auth = {
    resolved,
    showAsLoggedIn,
    user,
    login: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    showAsLoggedIn.set(false);
    resolved.set(false);
    user.set(null);

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: auth },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render a spinner', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('mat-spinner')).toBeNull();
  });

  // ─── Logged out ─────────────────────────────────────────────────────────────

  it('renders no auth controls before auth is resolved', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Login')).toBeFalsy();
    expect(findButton(compiled, 'Sign up')).toBeFalsy();
    expect(findButton(compiled, 'Dashboard')).toBeFalsy();
    expect(compiled.querySelector('[aria-haspopup="menu"]')).toBeNull();
  });

  it('should show Login but not Sign up when signed out', () => {
    resolved.set(true);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Login')).toBeTruthy();
    expect(findButton(compiled, 'Sign up')).toBeFalsy();
  });

  it('should not show the Dashboard button when signed out', () => {
    resolved.set(true);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Dashboard')).toBeFalsy();
  });

  it('should call auth.login with the current URL when Login is clicked', () => {
    resolved.set(true);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;

    findButton(compiled, 'Login')?.click();

    expect(auth.login).toHaveBeenCalledWith(router.url);
  });

  // ─── Logged in ──────────────────────────────────────────────────────────────

  it('should show the Dashboard button when signed in', async () => {
    showAsLoggedIn.set(true);
    resolved.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Dashboard')).toBeTruthy();
  });

  it('should not show the Login and Sign up buttons when signed in', async () => {
    showAsLoggedIn.set(true);
    resolved.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Login')).toBeFalsy();
    expect(findButton(compiled, 'Sign up')).toBeFalsy();
  });

  it('shows initials based on the display name in the account button', () => {
    user.set({
      uid: 'user-1',
      email: 'user@example.com',
      emailVerified: true,
      displayName: 'ScaleCloud User',
      claims: {},
    });
    showAsLoggedIn.set(true);
    resolved.set(true);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('.account-avatar')?.textContent?.trim()).toBe('SU');
  });

  it('uses email initials when the display name is absent', () => {
    user.set({
      uid: 'user-1',
      email: 'mary.jane@example.com',
      emailVerified: true,
      displayName: null,
      claims: {},
    });

    expect(component.accountInitials).toBe('MJ');
  });

  it('shows account identity and a Passkeys & MFA link in the account menu', async () => {
    user.set({
      uid: 'user-1',
      email: 'user@example.com',
      emailVerified: true,
      displayName: 'ScaleCloud User',
      claims: {},
    });
    showAsLoggedIn.set(true);
    resolved.set(true);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    compiled.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const accountMenu = document.body;
    expect(accountMenu.textContent).toContain('user@example.com');
    const securityLink = Array.from(accountMenu.querySelectorAll('a')).find((link) =>
      link.textContent?.includes('Passkeys & MFA'),
    );
    expect(securityLink?.getAttribute('href')).toBe(
      `${environment.oidc.authentikUrl}/if/user/#/settings;%7B%22page%22:%22page-credentials%22,%22ak-user-settings-mfa-page%22:0%7D`,
    );
    expect(securityLink?.getAttribute('target')).toBe('_blank');
  });

  it('should call auth.logout when logout is triggered', () => {
    component.logout();

    expect(auth.logout).toHaveBeenCalled();
  });

  // ─── toggleSideBar ────────────────────────────────────────────────────────────

  it('should emit toggleSideBarForMe when the menu button is clicked', () => {
    const emitSpy = vi.fn();
    component.toggleSideBarForMe.subscribe(emitSpy);

    component.toggleSideBar();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should call toggleSideBar when the menu icon button is clicked', () => {
    const toggleSpy = vi.spyOn(component, 'toggleSideBar');
    const compiled: HTMLElement = fixture.nativeElement;
    const menuButton = compiled.querySelector('button[mat-icon-button]') as HTMLButtonElement;

    menuButton?.click();

    expect(toggleSpy).toHaveBeenCalled();
  });

  // ─── Logo / branding ──────────────────────────────────────────────────────────

  it('should render the ScaleCloud.de brand link', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain('ScaleCloud.de');
  });

  it('should render the logo image', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('img.logo-icon')).not.toBeNull();
  });
});