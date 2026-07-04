import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { PageNotFoundComponent } from './page-not-found.component';
import { LogService } from 'src/app/core/logging/log.service';

// ─── Setup ────────────────────────────────────────────────────────────────────
// Router itself is NOT overridden with a stub. provideRouter([])'s internal
// setup reads from the real Router instance during initialisation, so
// swapping in a plain { url } stub breaks that setup with "Cannot read
// properties of undefined (reading 'root')". We use the real Router instead.
//
// navigateByUrl also requires the target URL to match a registered route —
// with no routes at all it throws NG04002 ("Cannot match any routes"), even
// for arbitrary 404-style paths. A catch-all wildcard route (plus an empty
// path route, since '/' doesn't match '**') gives navigation somewhere valid
// to land without needing to care what that destination renders.

@Component({ selector: 'app-blank-test-route', template: '' })
class BlankRouteComponent {}

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let router: Router;

  // Mocks
  const logService = { error: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent],
      providers: [
        provideRouter([
          { path: '', component: BlankRouteComponent },
          { path: '**', component: BlankRouteComponent },
        ]),
        { provide: LogService, useValue: logService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    await router.navigateByUrl('/some/missing/path');

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Rendered content ─────────────────────────────────────────────────────────

  it('should render the 404 title', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('404');
  });

  it('should render a "Page not found" message', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain('Page not found');
  });

  it('should render a Home button', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const button = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Home'),
    );
    expect(button).toBeTruthy();
  });

  it('should render exactly one button', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelectorAll('button').length).toBe(1);
  });

  // ─── ngOnInit / logging ────────────────────────────────────────────────────────

  it('should log the current URL as an error on init', () => {
    expect(logService.error).toHaveBeenCalledWith('Page not found: /some/missing/path');
  });

  it('should log exactly once on init', () => {
    expect(logService.error).toHaveBeenCalledTimes(1);
  });

  it('should reflect the router URL present at component creation time', async () => {
    vi.clearAllMocks();
    await router.navigateByUrl('/another/bad/url?foo=bar');

    const newFixture = TestBed.createComponent(PageNotFoundComponent);
    newFixture.detectChanges();

    expect(logService.error).toHaveBeenCalledWith('Page not found: /another/bad/url?foo=bar');
  });

  it('should not throw when the router URL is the root path', async () => {
    vi.clearAllMocks();
    await router.navigateByUrl('/');

    expect(() => {
      const rootFixture = TestBed.createComponent(PageNotFoundComponent);
      rootFixture.detectChanges();
    }).not.toThrow();

    expect(logService.error).toHaveBeenCalledWith('Page not found: /');
  });
});