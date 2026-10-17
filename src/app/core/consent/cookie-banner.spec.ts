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

  it('shows the first-layer consent actions without preselecting optional categories', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Reject all');
    expect(text).toContain('Accept all');
    expect(component.analytics()).toBe(false);
    expect(component.errorMonitoring()).toBe(false);
  });

  it('persists rejection and closes the banner', () => {
    const rejectButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button: HTMLButtonElement) => button.textContent?.includes('Reject all')) as HTMLButtonElement;

    rejectButton.click();
    fixture.detectChanges();

    expect(consent.decided()).toBe(true);
    expect(consent.analytics()).toBe(false);
    expect(consent.errorMonitoring()).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('saves a customized selection', () => {
    component.detailsOpen.set(true);
    component.analytics.set(true);
    component.errorMonitoring.set(false);
    fixture.detectChanges();

    component.saveSelection();
    fixture.detectChanges();

    expect(consent.analytics()).toBe(true);
    expect(consent.errorMonitoring()).toBe(false);
    expect(consent.bannerVisible()).toBe(false);
  });

  it('reopens settings with the saved selection', () => {
    consent.save(true, false);
    fixture.detectChanges();
    consent.reopen();
    fixture.detectChanges();

    expect(component.detailsOpen()).toBe(true);
    expect(component.analytics()).toBe(true);
    expect(component.errorMonitoring()).toBe(false);
  });
});