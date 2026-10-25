import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';

import { Sidebar } from './sidebar';

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Structure (always present regardless of inputs) ────────────────────────────

  it('should render four navigation items', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-list-item').length).toBe(4);
  });

  it('should render a Home navigation item with an icon', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const firstItem = compiled.querySelectorAll('mat-list-item')[0];
    expect(firstItem.querySelector('mat-icon')?.textContent).toContain('home');
  });

  it('should render the Buy section subheader', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain('Buy');
  });

  it('should render the Help section subheader', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain('Help');
  });

  it('should render two dividers', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-divider').length).toBe(2);
  });

  it('should render icons for all four navigation items', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-icon').length).toBe(4);
  });

  it('should render labels for all navigation items', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const labels = Array.from(compiled.querySelectorAll('.icon-text span')).map((label) => label.textContent);
    expect(labels).toContain('Home');
    expect(labels).toContain('Nextcloud');
    expect(labels).toContain('Synology');
    expect(labels).toContain('Contact');
  });
});