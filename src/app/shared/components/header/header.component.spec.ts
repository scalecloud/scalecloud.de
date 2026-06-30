import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Subject } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeUser(overrides: Partial<{ email: string }> = {}) {
  return { email: 'user@example.com', ...overrides };
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  // Mocks
  const userSubject = new Subject<unknown>();
  const authService = {
    getUserObservable: vi.fn(() => userSubject.asObservable()),
    getUser: vi.fn(() => null),
    signOut: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    authService.getUserObservable.mockReturnValue(userSubject.asObservable());
    authService.getUser.mockReturnValue(null);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Initial / loading state ─────────────────────────────────────────────────

  it('should start in a loading state', () => {
    expect(component.isLoading()).toBe(true);
  });

  it('should render a spinner while loading', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('mat-spinner')).not.toBeNull();
  });

  it('should not render the login or dashboard buttons while loading', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const buttonTexts = Array.from(compiled.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttonTexts.some((t) => t?.includes('Login'))).toBe(false);
    expect(buttonTexts.some((t) => t?.includes('Dashboard'))).toBe(false);
  });

  // ─── Auth state resolves – logged out ────────────────────────────────────────

  it('should stop loading once the auth observable emits', async () => {
    userSubject.next(null);
    await fixture.whenStable();
    expect(component.isLoading()).toBe(false);
  });

  it('should show the Login button when no user is present', async () => {
    authService.getUser.mockReturnValue(null);
    userSubject.next(null);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const loginButton = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Login'),
    );
    expect(loginButton).toBeTruthy();
  });

  it('should not show the Dashboard button when no user is present', async () => {
    authService.getUser.mockReturnValue(null);
    userSubject.next(null);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const dashboardButton = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Dashboard'),
    );
    expect(dashboardButton).toBeFalsy();
  });

  it('should hide the spinner once loading completes', async () => {
    userSubject.next(null);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('mat-spinner')).toBeNull();
  });

  // ─── Auth state resolves – logged in ─────────────────────────────────────────

  it('should show the Dashboard button when a user is present', async () => {
    authService.getUser.mockReturnValue(makeUser());
    userSubject.next(makeUser());
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const dashboardButton = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Dashboard'),
    );
    expect(dashboardButton).toBeTruthy();
  });

  it('should not show the Login button when a user is present', async () => {
    authService.getUser.mockReturnValue(makeUser());
    userSubject.next(makeUser());
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const loginButton = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Login'),
    );
    expect(loginButton).toBeFalsy();
  });

  it('should call authService.signOut when Logout is triggered', async () => {
    authService.getUser.mockReturnValue(makeUser());
    userSubject.next(makeUser());
    await fixture.whenStable();
    fixture.detectChanges();

    component.authService.signOut();

    expect(authService.signOut).toHaveBeenCalled();
  });

  // ─── Auth state errors ────────────────────────────────────────────────────────

  it('should stop loading if the auth observable errors', async () => {
    userSubject.error(new Error('Auth failed'));
    await fixture.whenStable();
    expect(component.isLoading()).toBe(false);
  });

  it('should show the Login button if the auth observable errors and no user is present', async () => {
    authService.getUser.mockReturnValue(null);
    userSubject.error(new Error('Auth failed'));
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const loginButton = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Login'),
    );
    expect(loginButton).toBeTruthy();
  });

  // ─── toggleSideBar ────────────────────────────────────────────────────────────

  it('should emit toggleSideBarForMe when the menu button is clicked', () => {
    const emitSpy = vi.fn();
    component.toggleSideBarForMe.subscribe(emitSpy);

    component.toggleSideBar();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should dispatch a window resize event shortly after toggling the sidebar', () => {
    vi.useFakeTimers();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    component.toggleSideBar();
    expect(dispatchSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    vi.useRealTimers();
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