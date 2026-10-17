import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Consent } from './consent';
import { CookieBanner } from './cookie-banner';

describe('CookieBanner', () => {
  let component: CookieBanner;
  let fixture: ComponentFixture<CookieBanner>;
  let consent: Consent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CookieBanner],
      providers: [provideRouter([])],
    }).compileComponents();

    consent = TestBed.inject(Consent);
    fixture = TestBed.createComponent(CookieBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('shows only the necessary and optional improvement choices', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Only necessary');
    expect(text).toContain('Accept all');
    expect(text).toContain('Your choice saves immediately.');
    expect(text).toContain('Technically necessary');
    expect(text).toContain('Help us improve (optional)');
    expect(text).toContain('Analytics');
    expect(text).toContain('Performance');
    expect(text).toContain('Replay');
    expect(text).toContain('Google Analytics');
    expect(text).toContain('Firebase Performance and Sentry Tracing');
    expect(text).toContain('Sampled Sentry page interactions');
    expect(text.indexOf('Performance')).toBeLessThan(text.indexOf('Replay'));
    expect(text.indexOf('Replay')).toBeLessThan(text.indexOf('Analytics'));
    expect(component.improvements()).toBe(false);
    expect(fixture.nativeElement.querySelectorAll('.option')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('mat-expansion-panel')).toBeNull();
  });

  it('persists rejection and closes the banner', () => {
    const rejectButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button: HTMLButtonElement) => button.textContent?.includes('Only necessary')) as HTMLButtonElement;

    rejectButton.click();
    fixture.detectChanges();

    expect(consent.decided()).toBe(true);
    expect(consent.improvements()).toBe(false);
    expect(fixture.nativeElement.querySelector('dialog.consent')).toBeNull();
  });

  it('saves the toggle immediately and closes the banner', () => {
    component.saveSelection(true);
    fixture.detectChanges();

    expect(consent.improvements()).toBe(true);
    expect(consent.bannerVisible()).toBe(false);
    expect(fixture.nativeElement.querySelector('dialog.consent')).toBeNull();

    consent.reopen();
    fixture.detectChanges();
    expect(component.improvements()).toBe(true);
  });

  it('accepts all optional tools with one click', () => {
    const acceptButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button: HTMLButtonElement) => button.textContent?.includes('Accept all')) as HTMLButtonElement;

    acceptButton.click();
    fixture.detectChanges();

    expect(consent.improvements()).toBe(true);
    expect(fixture.nativeElement.querySelector('dialog.consent')).toBeNull();
  });
});