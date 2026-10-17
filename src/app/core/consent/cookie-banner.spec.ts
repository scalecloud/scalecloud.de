import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Consent } from './consent';
import { CookieBanner } from './cookie-banner';

describe('CookieBanner', () => {
  let fixture: ComponentFixture<CookieBanner>;
  let consent: Consent;

  function button(label: string): HTMLButtonElement {
    return Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((b) => (b as HTMLButtonElement).textContent?.includes(label)) as HTMLButtonElement;
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CookieBanner],
      providers: [provideRouter([])],
    }).compileComponents();

    consent = TestBed.inject(Consent);
    fixture = TestBed.createComponent(CookieBanner);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('names the purposes, the tools, the recipients and the way to withdraw', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Optional tools help improve ScaleCloud.de.');
    expect(text).toContain('Google Analytics measures usage');
    expect(text).toContain('Firebase Performance and Sentry Tracing measure speed');
    expect(text).toContain('Sentry Replay records sampled sessions with text and inputs masked,');
    expect(text.indexOf('Firebase Performance')).toBeLessThan(text.indexOf('Sentry Replay'));
    expect(text.indexOf('Sentry Replay')).toBeLessThan(text.indexOf('Google Analytics'));
    expect(text).toContain('Data is sent to Sentry and Google.');
    expect(text).toContain('Always active');
    expect(text).toContain('Essential service functions and technical logs and error reports remain active regardless of your choice.');
    expect(text).not.toContain('Authentication tokens are stored in your browser');
    expect(text).toContain('Cookie settings');
    expect(text).toContain('Privacy policy');
    expect(text.indexOf('Always active')).toBeLessThan(text.indexOf('Reject all'));
    expect(fixture.nativeElement.querySelector('dialog.consent')).not.toBeNull();
  });

  it('presents reject and accept with identical styling', () => {
    const [reject, accept] = Array.from(
      fixture.nativeElement.querySelectorAll('.actions button'),
    ) as HTMLButtonElement[];

    expect(reject.textContent).toContain('Reject all');
    expect(accept.textContent).toContain('Accept all');
    expect(reject.hasAttribute('mat-stroked-button')).toBe(true);
    expect(accept.hasAttribute('mat-stroked-button')).toBe(true);
    expect(reject.className).toBe(accept.className);
  });

  it('persists rejection and closes the banner', () => {
    button('Reject all').click();
    fixture.detectChanges();

    expect(consent.decided()).toBe(true);
    expect(consent.improvements()).toBe(false);
    expect(fixture.nativeElement.querySelector('dialog.consent')).toBeNull();
  });

  it('accepts the optional tools with one click', () => {
    button('Accept all').click();
    fixture.detectChanges();

    expect(consent.improvements()).toBe(true);
    expect(fixture.nativeElement.querySelector('dialog.consent')).toBeNull();
  });

  it('shows the banner again when cookie settings are reopened', () => {
    button('Accept all').click();
    fixture.detectChanges();

    consent.reopen();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('dialog.consent')).not.toBeNull();
  });
});