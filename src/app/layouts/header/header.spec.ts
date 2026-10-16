import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { Header } from './header';
import { Auth } from 'src/app/core/auth/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findButton(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.includes(text));
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;

  // Mirrors Auth.showAsLoggedIn: the last known state on the first frame, the real state later.
  const showAsLoggedIn = signal(false);
  const auth = {
    showAsLoggedIn,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    showAsLoggedIn.set(false);

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

  it('should show the Login and Sign up buttons when signed out', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Login')).toBeTruthy();
    expect(findButton(compiled, 'Sign up')).toBeTruthy();
  });

  it('should not show the Dashboard button when signed out', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Dashboard')).toBeFalsy();
  });

  it('should call auth.login with the current URL when Login is clicked', () => {
    const compiled: HTMLElement = fixture.nativeElement;

    findButton(compiled, 'Login')?.click();

    expect(auth.login).toHaveBeenCalledWith(router.url);
  });

  it('should call auth.register with the current URL when Sign up is clicked', () => {
    const compiled: HTMLElement = fixture.nativeElement;

    findButton(compiled, 'Sign up')?.click();

    expect(auth.register).toHaveBeenCalledWith(router.url);
  });

  // ─── Logged in ──────────────────────────────────────────────────────────────

  it('should show the Dashboard button when signed in', async () => {
    showAsLoggedIn.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Dashboard')).toBeTruthy();
  });

  it('should not show the Login and Sign up buttons when signed in', async () => {
    showAsLoggedIn.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(findButton(compiled, 'Login')).toBeFalsy();
    expect(findButton(compiled, 'Sign up')).toBeFalsy();
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