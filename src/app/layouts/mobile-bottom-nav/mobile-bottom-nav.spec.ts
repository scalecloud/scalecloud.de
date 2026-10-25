import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';

import { Auth } from 'src/app/core/auth/auth';
import { MobileBottomNav } from './mobile-bottom-nav';

describe('MobileBottomNav', () => {
  let fixture: ComponentFixture<MobileBottomNav>;
  const resolved = signal(true);
  const showAsLoggedIn = signal(false);

  beforeEach(async () => {
    resolved.set(true);
    showAsLoggedIn.set(false);

    await TestBed.configureTestingModule({
      imports: [MobileBottomNav],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: { resolved, showAsLoggedIn } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileBottomNav);
    fixture.detectChanges();
  });

  it('renders the public destinations', () => {
    const labels = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('nav a span'),
    ).map((label) => label.textContent);

    expect(labels).toEqual(['Home', 'Nextcloud', 'Synology']);
  });

  it('adds Dashboard for signed-in users', () => {
    showAsLoggedIn.set(true);
    fixture.detectChanges();

    const labels = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('nav a span'),
    ).map((label) => label.textContent);

    expect(labels).toEqual(['Home', 'Nextcloud', 'Synology', 'Dashboard']);
  });
});