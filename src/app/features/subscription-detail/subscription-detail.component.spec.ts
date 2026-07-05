import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { SubscriptionDetailComponent } from './subscription-detail.component';
import { SubscriptionDetailCardComponent } from './subscription-detail-card/subscription-detail-card.component';
import { SeatsComponent } from './seats/seats.component';
import { PaymentMethodOverviewComponent } from '../dashboard/payment-method-overview/payment-method-overview.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { BillingAddressOverviewComponent } from './billing-address/billing-address-overview/billing-address-overview.component';
import { BillingPortalComponent } from './customer-portal/billing-portal.component';
import { Auth } from 'src/app/core/auth/auth';
import { API_URL, APP_BASE_URL } from 'src/app/core/config/api-token';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true if the compiled template contains the given CSS selector. */
function hasElement(fixture: ComponentFixture<unknown>, selector: string): boolean {
  return fixture.debugElement.query(By.css(selector)) !== null;
}

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('SubscriptionDetailComponent', () => {
  let component: SubscriptionDetailComponent;
  let fixture: ComponentFixture<SubscriptionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionDetailComponent],
      providers: [
        // Several root services form a chain: Auth → ReturnUrlService →
        // ActivatedRoute + APP_BASE_URL. Mocking the whole chain here is more
        // robust than stubbing individual tokens one error at a time.
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
        { provide: API_URL, useValue: 'https://api.test' },
        { provide: APP_BASE_URL, useValue: 'https://app.test' },
        { provide: ReturnUrl, useValue: { getReturnUrlDecoded: vi.fn(), openReturnURL: vi.fn(), openUrlKeepReturnUrl: vi.fn() } },
        {
          provide: Auth,
          useValue: {
            waitForAuth: vi.fn().mockResolvedValue(undefined),
            getHttpOptions: vi.fn().mockReturnValue({}),
          },
        },
      ],
    })
    // This component is a layout shell. Stubbing every child prevents their
    // full dependency trees (services, HTTP, tokens) from being instantiated,
    // keeping these tests fast and focused on what this component owns.
    .overrideComponent(SubscriptionDetailCardComponent, { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(SeatsComponent,                  { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(PaymentMethodOverviewComponent,        { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(InvoicesComponent,               { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(BillingAddressOverviewComponent, { set: { template: '', imports: [], providers: [] } })
    .overrideComponent(BillingPortalComponent,          { set: { template: '', imports: [], providers: [] } })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Layout ────────────────────────────────────────────────────────────────

  it('renders a flex container', () => {
    expect(hasElement(fixture, '.flex-container')).toBe(true);
  });

  it('wraps each child in a flex-item div', () => {
    const items = fixture.debugElement.queryAll(By.css('.flex-item'));
    expect(items.length).toBe(6);
  });

  // ── Child components ──────────────────────────────────────────────────────

  it('includes the subscription detail card', () => {
    expect(hasElement(fixture, 'app-subscription-detail-card')).toBe(true);
  });

  it('includes the seats component', () => {
    expect(hasElement(fixture, 'app-seats')).toBe(true);
  });

  it('includes the payment overview', () => {
    expect(hasElement(fixture, 'app-payment-method-overview')).toBe(true);
  });

  it('includes the invoices component', () => {
    expect(hasElement(fixture, 'app-invoices')).toBe(true);
  });

  it('includes the billing address overview', () => {
    expect(hasElement(fixture, 'app-billing-address-overview')).toBe(true);
  });

  it('includes the billing portal', () => {
    expect(hasElement(fixture, 'app-billing-portal')).toBe(true);
  });

  it('renders all six child components', () => {
    const selectors = [
      'app-subscription-detail-card',
      'app-seats',
      'app-payment-method-overview',
      'app-invoices',
      'app-billing-address-overview',
      'app-billing-portal',
    ];
    for (const selector of selectors) {
      expect(hasElement(fixture, selector), `missing: ${selector}`).toBe(true);
    }
  });

  // ── Order ─────────────────────────────────────────────────────────────────

  it('renders child components in the correct order', () => {
    const selectors = fixture.debugElement
      .queryAll(By.css('.flex-item > *'))
      .map(el => el.name);

    expect(selectors).toEqual([
      'app-subscription-detail-card',
      'app-seats',
      'app-payment-method-overview',
      'app-invoices',
      'app-billing-address-overview',
      'app-billing-portal',
    ]);
  });

  // ── Each child is wrapped ─────────────────────────────────────────────────

  it('wraps every child component in its own flex-item', () => {
    const selectors = [
      'app-subscription-detail-card',
      'app-seats',
      'app-payment-method-overview',
      'app-invoices',
      'app-billing-address-overview',
      'app-billing-portal',
    ];
    for (const selector of selectors) {
      const el = fixture.debugElement.query(By.css(selector));
      expect(el.parent?.classes['flex-item'], `${selector} not wrapped in flex-item`).toBe(true);
    }
  });
});