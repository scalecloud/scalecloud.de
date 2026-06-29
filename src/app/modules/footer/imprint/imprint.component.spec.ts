import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouterLink }      from '@angular/router';
import { ComponentFixture, TestBed }      from '@angular/core/testing';
import { By }                             from '@angular/platform-browser';

import { describe, beforeEach, it, expect } from 'vitest';

import { ImprintComponent } from './imprint.component';

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('ImprintComponent', () => {
  let component: ImprintComponent;
  let fixture:   ComponentFixture<ImprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:   [ImprintComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ImprintComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Headings ──────────────────────────────────────────────────────────────

  it('renders an h1 with the text "Imprint"', () => {
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Imprint');
  });

  it('renders a mat-divider below the h1', () => {
    const divider = fixture.nativeElement.querySelector('mat-divider');
    expect(divider).toBeTruthy();
  });

  it('renders a Finance section heading', () => {
    const headings: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('h2'));
    const financeHeading = headings.find(h => h.textContent?.includes('Finance'));
    expect(financeHeading).toBeTruthy();
  });

  it('renders a Bank details sub-heading', () => {
    const h3: HTMLElement = fixture.nativeElement.querySelector('h3');
    expect(h3?.textContent?.trim()).toBe('Bank details:');
  });

  it('renders an Online dispute resolution section heading', () => {
    const headings: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('h2'));
    const odrHeading = headings.find(h => h.textContent?.includes('Online dispute resolution'));
    expect(odrHeading).toBeTruthy();
  });

  // ── RouterLinks ───────────────────────────────────────────────────────────

  it('has a RouterLink pointing to /contact', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const contactLink = links.find(
      l => l.injector.get(RouterLink).urlTree?.toString() === '/contact',
    );
    expect(contactLink).toBeTruthy();
  });

  it('has a RouterLink pointing to /', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const homeLink = links.find(
      l => l.injector.get(RouterLink).urlTree?.toString() === '/',
    );
    expect(homeLink).toBeTruthy();
  });

  // ── External links ────────────────────────────────────────────────────────

  it('renders the support e-mail mailto link', () => {
    const anchors: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a[href]'));
    const mailtoLink = anchors.find(a => a.href.startsWith('mailto:'));
    expect(mailtoLink).toBeTruthy();
    expect(mailtoLink?.href).toContain('support@scalecloud.de');
  });

  it('renders the ODR platform link with the correct href', () => {
    const anchors: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a[href]'));
    const odrLink = anchors.find(a => a.href.includes('ec.europa.eu'));
    expect(odrLink).toBeTruthy();
    expect(odrLink?.getAttribute('target')).toBe('_blank');
    expect(odrLink?.getAttribute('rel')).toContain('noopener');
  });

  // ── Content ───────────────────────────────────────────────────────────────

  it('displays the address', () => {
    const body: string = fixture.nativeElement.textContent ?? '';
    expect(body).toContain('Flensburg');
    expect(body).toContain('Germany');
  });

  it('displays the ScaleCloud.de web link text', () => {
    const body: string = fixture.nativeElement.textContent ?? '';
    expect(body).toContain('ScaleCloud.de');
  });
});