import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { SubscriptionOverviewComponent } from './subscription-overview.component';
import { ISubscriptionOverview } from './subscription-overview';

const MOCK_SUBSCRIPTION: ISubscriptionOverview = {
  id:            'sub-123',
  active:        true,
  productName:   'Pro Plan',
  productType:   'SaaS',
  storageAmount: 10,
  userCount:     3,
};

describe('SubscriptionOverviewComponent', () => {
  let component: SubscriptionOverviewComponent;
  let fixture:   ComponentFixture<SubscriptionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionOverviewComponent, RouterTestingModule],
    }).compileComponents();

    fixture   = TestBed.createComponent(SubscriptionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── No input ───────────────────────────────────────────────────────────────

  describe('when subscriptionOverview is undefined', () => {
    it('totalStorageAmount returns 0', () => {
      expect(component.totalStorageAmount).toBe(0);
    });
  });

  // ── With input ─────────────────────────────────────────────────────────────

  describe('when subscriptionOverview is provided', () => {
    beforeEach(() => {
      component.subscriptionOverview = MOCK_SUBSCRIPTION;
    });

    it('exposes the subscription data on the input', () => {
      expect(component.subscriptionOverview?.id).toBe('sub-123');
      expect(component.subscriptionOverview?.active).toBe(true);
      expect(component.subscriptionOverview?.productName).toBe('Pro Plan');
      expect(component.subscriptionOverview?.productType).toBe('SaaS');
    });

    it('reflects an inactive subscription', () => {
      component.subscriptionOverview = { ...MOCK_SUBSCRIPTION, active: false };
      expect(component.subscriptionOverview?.active).toBe(false);
    });

    it('calculates totalStorageAmount as storageAmount × userCount', () => {
      expect(component.totalStorageAmount).toBe(30); // 10 × 3
    });

    it('returns 0 for totalStorageAmount when storageAmount is 0', () => {
      component.subscriptionOverview = { ...MOCK_SUBSCRIPTION, storageAmount: 0 };
      expect(component.totalStorageAmount).toBe(0);
    });

    it('returns 0 for totalStorageAmount when userCount is 0', () => {
      component.subscriptionOverview = { ...MOCK_SUBSCRIPTION, userCount: 0 };
      expect(component.totalStorageAmount).toBe(0);
    });
  });
});