import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { HomeComponent } from './home.component';
import { GlobeComponent } from '../globe/globe.component';
import { NewsletterSubscribeComponent } from '../../../shared/components/newsletter/newsletter-subscribe/newsletter-subscribe.component';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';

// ─── Stubs ────────────────────────────────────────────────────────────────────
// HomeComponent only cares that these children are present, not what they do
// internally. Stubbing them keeps this a true unit test of HomeComponent and
// avoids needing cobe/NewsletterService/etc. wired up just to render a parent.

@Component({ selector: 'app-globe', template: '' })
class GlobeStubComponent {}

@Component({ selector: 'app-newsletter-subscribe', template: '' })
class NewsletterSubscribeStubComponent {}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const snackBarService = { errorDuration: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: SnackBarService, useValue: snackBarService },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [GlobeComponent, NewsletterSubscribeComponent] },
        add: { imports: [GlobeStubComponent, NewsletterSubscribeStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
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

  // ─── ngOnInit / SnackBarService ────────────────────────────────────────────────

  it('should show an under-construction warning on init', () => {
    expect(snackBarService.errorDuration).toHaveBeenCalledWith(
      'This Website is currently under construction. Please come back later.',
      30,
    );
  });

  it('should show the under-construction warning exactly once', () => {
    expect(snackBarService.errorDuration).toHaveBeenCalledTimes(1);
  });
});