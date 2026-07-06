import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { HomePage } from './home-page';
import { Globe } from './globe/globe';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { NewsletterSubscribe } from '../newsletter-client/newsletter-subscribe/newsletter-subscribe';

// ─── Stubs ────────────────────────────────────────────────────────────────────
// HomeComponent only cares that these children are present, not what they do
// internally. Stubbing them keeps this a true unit test of HomeComponent and
// avoids needing cobe/Newsletter/etc. wired up just to render a parent.

@Component({ selector: 'app-globe', template: '' })
class GlobeStubComponent {}

@Component({ selector: 'app-newsletter-subscribe', template: '' })
class NewsletterSubscribeStubComponent {}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const snackBar = { errorDuration: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        { provide: SnackBar, useValue: snackBar },
      ],
    })
      .overrideComponent(HomePage, {
        remove: { imports: [Globe, NewsletterSubscribe] },
        add: { imports: [GlobeStubComponent, NewsletterSubscribeStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Rendered content ─────────────────────────────────────────────────────────

  it('should render the title', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('ScaleCloud.de');
  });

  it('should render the subtitle', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Ready for your Cloud?');
  });

  it('should render the globe component', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('app-globe')).not.toBeNull();
  });

  it('should render the newsletter subscribe component', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('app-newsletter-subscribe')).not.toBeNull();
  });

  it('should render a divider between the title and subtitle', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('mat-divider')).not.toBeNull();
  });

  // ─── Navigation buttons ───────────────────────────────────────────────────────

  it('should render a button linking to /nextcloud', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const found = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('EXPLORE NEXTCLOUD'),
    );
    expect(found).toBeTruthy();
  });

  it('should render a button linking to /synology', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const found = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('EXPLORE SYNOLOGY'),
    );
    expect(found).toBeTruthy();
  });

  it('should render exactly two call-to-action buttons', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.flex-container button');
    expect(buttons.length).toBe(2);
  });

  // ─── ngOnInit / SnackBar ────────────────────────────────────────────────

  it('should show an under-construction warning on init', () => {
    expect(snackBar.errorDuration).toHaveBeenCalledWith(
      'This Website is currently under construction. Please come back later.',
      30,
    );
  });

  it('should show the under-construction warning exactly once', () => {
    expect(snackBar.errorDuration).toHaveBeenCalledTimes(1);
  });
});