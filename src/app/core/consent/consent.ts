import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'scalecloud.consent';
const CONSENT_VERSION = 4;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

interface StoredConsent {
  version: number;
  timestamp: number;
  improvements: boolean;
}

@Injectable({ providedIn: 'root' })
export class Consent {
  private readonly stored = signal<StoredConsent | null>(this.load());
  private readonly reopened = signal(false);

  readonly decided = computed(() => this.stored() !== null);
  readonly improvements = computed(() => this.stored()?.improvements ?? false);
  readonly bannerVisible = computed(() => !this.decided() || this.reopened());

  acceptAll(): void {
    this.save(true);
  }

  rejectAll(): void {
    this.save(false);
  }

  save(improvements: boolean): void {
    const value: StoredConsent = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      improvements,
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
        && typeof value.improvements === 'boolean';

      return valid ? value as StoredConsent : null;
    } catch {
      return null;
    }
  }
}