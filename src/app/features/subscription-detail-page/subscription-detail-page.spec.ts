import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { SubscriptionDetailPage } from './subscription-detail-page';
import { SubscriptionDetailCard } from './subscription-detail-card/subscription-detail-card';
import { Seats } from './seats/seats';
import { PaymentMethodOverview } from '../dashboard-page/payment-method-overview/payment-method-overview';
import { Invoices } from './invoices/invoices';
import { BillingAddressOverview } from './billing-address-client/billing-address-overview/billing-address-overview';
import { BillingPortal } from './customer-portal/billing-portal';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL, APP_BASE_URL } from 'src/app/core/config/api-token';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true if the compiled template contains the given CSS selector. */
function hasElement(fixture: ComponentFixture<unknown>, selector: string): boolean {
  return fixture.debugElement.query(By.css(selector)) !== null;
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('SubscriptionDetailPage', () => {
  let component: SubscriptionDetailPage;
  let fixture: ComponentFixture<SubscriptionDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionDetailPage],
      providers: [
        // Several root services form a chain: Auth → ReturnUrl →
        // ActivatedRoute + APP_BASE_URL. Mocking the whole chain here is more
        // robust than stubbing individual tokens one error at a time.
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
        { provide: API_URL, useValue: 'https://api.test' },
        { provide: APP_BASE_URL, useValue: 'https://app.test' },
        { provide: ReturnUrl, useValue: { getReturnUrlDecoded: vi.fn(), openReturnURL: vi.fn(), openUrlKeepReturnUrl: vi.fn() } },
        {
          provide: Auth,
          useValue: {},
        },
      ],
    })
    // This component is a layout shell. Stubbing every child prevents their
    // full dependency trees (services, HTTP, tokens) from being instantiated,
    // keeping these tests fast and focused on what this component owns.
    .overrideComponent(SubscriptionDetailCard, { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(Seats,                  { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(PaymentMethodOverview,        { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(Invoices,               { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(BillingAddressOverview, { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(BillingPortal,          { set: { template: '', imports: [], providers: [] } })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders Overview, Users & Spaces, and Billing tabs', () => {
    const tabs: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));

    expect(tabs.map(tab => tab.textContent?.trim())).toEqual([
      'Overview',
      'Users & Spaces',
      'Billing',
    ]);
  });

  it('shows the subscription card in the Overview tab', () => {
    expect(hasElement(fixture, 'app-subscription-detail-card')).toBe(true);
    expect(hasElement(fixture, 'app-seats')).toBe(false);
    expect(hasElement(fixture, 'app-payment-method-overview')).toBe(false);
  });

});