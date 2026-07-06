import { provideRouter, RouterLink }      from '@angular/router';
import { ComponentFixture, TestBed }      from '@angular/core/testing';
import { By }                             from '@angular/platform-browser';

import { describe, beforeEach, it, expect } from 'vitest';

import { SubscriptionOverview } from './subscription-overview';
import { SubscriptionOverviewModel } from './subscription-overview-model';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_SUBSCRIPTION: SubscriptionOverviewModel = {
  id:            'sub-123',
  active:        true,
  productName:   'Pro Plan',
  productType:   'SaaS',
  storageAmount: 10,
  userCount:     3,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns trimmed text content for a CSS selector, or null when absent. */
function text(fixture: ComponentFixture<unknown>, selector: string): string | null {
  const el = fixture.nativeElement.querySelector(selector);
  return el ? (el.textContent ?? '').trim() : null;
}

/** Returns true when at least one element matching the selector exists. */
function exists(fixture: ComponentFixture<unknown>, selector: string): boolean {
  return fixture.nativeElement.querySelector(selector) !== null;
}

/** Set an input and wait for the view to settle. */
async function setInput<T>(
  fix: ComponentFixture<T>,
  name: string,
  value: unknown,
): Promise<void> {
  fix.componentRef.setInput(name, value);
  await fix.whenStable();
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('SubscriptionOverview', () => {
  let component: SubscriptionOverview;
  let fixture:   ComponentFixture<SubscriptionOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:   [SubscriptionOverview],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(SubscriptionOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ── Creation ─────────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── No input (undefined) ─────────────────────────────────────────────────────

  describe('when subscriptionOverview is undefined', () => {
    it('totalStorageAmount signal returns 0', () => {
      expect(component.totalStorageAmount()).toBe(0);
    });

    it('renders no active/inactive chip', () => {
      expect(exists(fixture, 'mat-chip')).toBe(false);
    });
  });

  // ── With input ────────────────────────────────────────────────────────────────

  describe('when subscriptionOverview is provided', () => {
    beforeEach(async () => {
      await setInput(fixture, 'subscriptionOverview', MOCK_SUBSCRIPTION);
    });

    // ── Logic ──────────────────────────────────────────────────────────────────

    it('exposes id, active, productName, and productType via the input signal', () => {
      const sub = component.subscriptionOverviewModel();
      expect(sub?.id).toBe('sub-123');
      expect(sub?.active).toBe(true);
      expect(sub?.productName).toBe('Pro Plan');
      expect(sub?.productType).toBe('SaaS');
    });

    it('calculates totalStorageAmount as storageAmount × userCount', () => {
      expect(component.totalStorageAmount()).toBe(30); // 10 × 3
    });

    it('returns 0 for totalStorageAmount when storageAmount is 0', async () => {
      await setInput(fixture, 'subscriptionOverview', { ...MOCK_SUBSCRIPTION, storageAmount: 0 });
      expect(component.totalStorageAmount()).toBe(0);
    });

    it('returns 0 for totalStorageAmount when userCount is 0', async () => {
      await setInput(fixture, 'subscriptionOverview', { ...MOCK_SUBSCRIPTION, userCount: 0 });
      expect(component.totalStorageAmount()).toBe(0);
    });

    it('handles large values without overflow', async () => {
      await setInput(fixture, 'subscriptionOverview', { ...MOCK_SUBSCRIPTION, storageAmount: 1_000, userCount: 1_000 });
      expect(component.totalStorageAmount()).toBe(1_000_000);
    });

    it('reflects an inactive subscription on the signal', async () => {
      await setInput(fixture, 'subscriptionOverview', { ...MOCK_SUBSCRIPTION, active: false });
      expect(component.subscriptionOverviewModel()?.active).toBe(false);
    });

    // ── DOM / template ─────────────────────────────────────────────────────────

    it('renders the product name as the card title', () => {
      expect(text(fixture, 'mat-card-title')).toBe('Pro Plan');
    });

    it('renders the product type as the card subtitle', () => {
      const subtitle = fixture.nativeElement.querySelector('mat-card-subtitle');
      expect(subtitle?.textContent).toContain('SaaS');
    });

    it('renders the subscription id in the list', () => {
      const items: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('mat-list-item');
      const idItem = Array.from(items).find(el => el.textContent?.includes('sub-123'));
      expect(idItem).toBeTruthy();
    });

    it('renders the computed storage amount in the list', () => {
      const items: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('mat-list-item');
      const storageItem = Array.from(items).find(el => el.textContent?.includes('Storage:'));
      expect(storageItem?.textContent).toContain('30 TB');
    });

    it('renders the user count in the list', () => {
      const items: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('mat-list-item');
      const usersItem = Array.from(items).find(el => el.textContent?.includes('Users:'));
      expect(usersItem?.textContent).toContain('3');
    });

    it('shows the "Active" chip for an active subscription', () => {
      const chip = fixture.nativeElement.querySelector('mat-chip');
      expect(chip?.textContent?.trim()).toBe('Active');
    });

    it('shows the "Inactive" chip for an inactive subscription', async () => {
      await setInput(fixture, 'subscriptionOverview', { ...MOCK_SUBSCRIPTION, active: false });
      const chip = fixture.nativeElement.querySelector('mat-chip');
      expect(chip?.textContent?.trim()).toBe('Inactive');
    });

    it('the details button links to the correct subscription route', () => {
      const btn = fixture.debugElement.query(By.directive(RouterLink));
      expect(btn).toBeTruthy();
      const routerLink = btn.injector.get(RouterLink);
      expect(routerLink.urlTree?.toString()).toContain('sub-123');
    });
  });
});