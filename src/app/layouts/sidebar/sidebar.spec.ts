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

  // ─── Default inputs ───────────────────────────────────────────────────────────

  it('should default isExpanded to undefined', () => {
    expect(component.isExpanded()).toBeUndefined();
  });

  it('should default isShowing to undefined', () => {
    expect(component.isShowing()).toBeUndefined();
  });

  it('should not render text labels by default (collapsed, not showing)', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('.icon-text span')).toBeNull();
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

  // ─── isExpanded = true ────────────────────────────────────────────────────────

  it('should show text labels when isExpanded is true', () => {
    fixture.componentRef.setInput('isExpanded', true);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const labels = Array.from(compiled.querySelectorAll('.icon-text span')).map((s) => s.textContent);
    expect(labels).toContain('Home');
    expect(labels).toContain('Nextcloud');
    expect(labels).toContain('Synology');
    expect(labels).toContain('Contact');
  });

  // ─── isShowing = true ─────────────────────────────────────────────────────────

  it('should show text labels when isShowing is true', () => {
    fixture.componentRef.setInput('isShowing', true);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const labels = Array.from(compiled.querySelectorAll('.icon-text span')).map((s) => s.textContent);
    expect(labels).toContain('Home');
  });

  // ─── isExpanded = false, isShowing = false ───────────────────────────────────────

  it('should hide text labels when both isExpanded and isShowing are explicitly false', () => {
    fixture.componentRef.setInput('isExpanded', false);
    fixture.componentRef.setInput('isShowing', false);
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('.icon-text span')).toBeNull();
  });

  // ─── Reactivity ───────────────────────────────────────────────────────────────

  it('should reveal labels when isExpanded transitions from false to true', () => {
    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.icon-text span')).toBeNull();

    fixture.componentRef.setInput('isExpanded', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.icon-text span')).not.toBeNull();
  });

  it('should hide labels again when isExpanded transitions back to false (with isShowing false)', () => {
    fixture.componentRef.setInput('isExpanded', true);
    fixture.componentRef.setInput('isShowing', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.icon-text span')).not.toBeNull();

    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.icon-text span')).toBeNull();
  });
});