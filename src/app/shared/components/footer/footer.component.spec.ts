import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';

import { FooterComponent } from './footer.component';

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Structure ────────────────────────────────────────────────────────────────

  it('should render a divider above the footer', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('mat-divider')).not.toBeNull();
  });

  it('should render a <footer> element', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('footer')).not.toBeNull();
  });

  // ─── Navigation links ───────────────────────────────────────────────────────────

  it('should render a link to the privacy policy', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const link = Array.from(compiled.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Privacy Policy'),
    );
    expect(link).toBeTruthy();
  });

  it('should render a link to the imprint', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const link = Array.from(compiled.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Imprint'),
    );
    expect(link).toBeTruthy();
  });

  it('should render a link to the legal page', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const link = Array.from(compiled.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Legal'),
    );
    expect(link).toBeTruthy();
  });

  it('should render a link to the terms page', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const link = Array.from(compiled.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Terms'),
    );
    expect(link).toBeTruthy();
  });

  it('should render a copyright link back to the homepage', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const link = Array.from(compiled.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('2026 ScaleCloud.de'),
    );
    expect(link).toBeTruthy();
  });

  it('should render exactly five links', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelectorAll('a').length).toBe(5);
  });

  it('should render two navigation lists', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelectorAll('ul.navigation').length).toBe(2);
  });
});