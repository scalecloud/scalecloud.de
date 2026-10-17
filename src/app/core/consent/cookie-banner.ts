import { Component, ChangeDetectionStrategy, effect, inject, signal, untracked } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';

import { Consent } from './consent';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatSlideToggle, RouterLink],
})
export class CookieBanner {
  readonly consent = inject(Consent);
  readonly detailsOpen = signal(false);
  readonly analytics = signal(false);
  readonly errorMonitoring = signal(false);

  constructor() {
    effect(() => {
      if (this.consent.bannerVisible()) {
        untracked(() => {
          this.analytics.set(this.consent.analytics());
          this.errorMonitoring.set(this.consent.errorMonitoring());
          this.detailsOpen.set(this.consent.decided());
        });
      }
    });
  }

  saveSelection(): void {
    this.consent.save(this.analytics(), this.errorMonitoring());
  }
}