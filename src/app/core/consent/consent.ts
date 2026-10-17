import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'scalecloud.consent';
const CONSENT_VERSION = 1;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

interface StoredConsent {
  version: number;
  timestamp: number;
  analytics: boolean;
  errorMonitoring: boolean;
}

@Injectable({ providedIn: 'root' })
export class Consent {
  private readonly stored = signal<StoredConsent | null>(this.load());
  private readonly reopened = signal(false);

  readonly decided = computed(() => this.stored() !== null);
  readonly analytics = computed(() => this.stored()?.analytics ?? false);
  readonly errorMonitoring = computed(() => this.stored()?.errorMonitoring ?? false);
  readonly bannerVisible = computed(() => !this.decided() || this.reopened());

  acceptAll(): void {
    this.save(true, true);
  }

  rejectAll(): void {
    this.save(false, false);
  }

  save(analytics: boolean, errorMonitoring: boolean): void {
    const value: StoredConsent = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      analytics,
      errorMonitoring,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Keep the choice for this page session if browser storage is unavailable.
    }

    this.stored.set(value);
    this.reopened.set(false);
  }

  reopen(): void {
    this.reopened.set(true);
  }

  private load(): StoredConsent | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const value = JSON.parse(raw) as Partial<StoredConsent>;
      const valid = value.version === CONSENT_VERSION
        && typeof value.timestamp === 'number'
        && value.timestamp <= Date.now()
        && Date.now() - value.timestamp < MAX_AGE_MS
        && typeof value.analytics === 'boolean'
        && typeof value.errorMonitoring === 'boolean';

      return valid ? value as StoredConsent : null;
    } catch {
      return null;
    }
  }
}