import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
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
  readonly contentCenterX = signal<number | null>(null);
  readonly contentWidth = signal<number | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver: ResizeObserver | undefined;
  private mutationObserver: MutationObserver | undefined;

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

    afterNextRender(() => this.observeContentRegion());
    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.mutationObserver?.disconnect();
      window.removeEventListener('resize', this.updateContentRegion);
    });
  }

  saveSelection(): void {
    this.consent.save(this.analytics(), this.errorMonitoring());
  }

  private readonly updateContentRegion = (): void => {
    const contentRegion = document.querySelector<HTMLElement>('mat-drawer-content');
    if (!contentRegion) {
      return;
    }
    const bounds = contentRegion.getBoundingClientRect();
    this.contentCenterX.set(bounds.left + bounds.width / 2);
    this.contentWidth.set(Math.max(0, Math.min(620, bounds.width - 32)));
  };

  private observeContentRegion(): void {
    const contentRegion = document.querySelector<HTMLElement>('mat-drawer-content');
    if (contentRegion) {
      this.updateContentRegion();
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.updateContentRegion);
        this.resizeObserver.observe(contentRegion);
      }
      window.addEventListener('resize', this.updateContentRegion);
      return;
    }

    if (typeof MutationObserver !== 'undefined' && document.body) {
      this.mutationObserver = new MutationObserver(() => {
        const region = document.querySelector<HTMLElement>('mat-drawer-content');
        if (region) {
          this.mutationObserver?.disconnect();
          this.observeContentRegion();
        }
      });
      this.mutationObserver.observe(document.body, { childList: true, subtree: true });
    }
  }
}