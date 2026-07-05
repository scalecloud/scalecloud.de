import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { SubscriptionCardComponent } from './subscription-card.component';
import { NextcloudProduct } from '../nextcloud-page/nextcloud-product';
import { SynologyProduct } from '../synology-page/synology-product';

describe('SubscriptionCardComponent', () => {
  let fixture: ComponentFixture<SubscriptionCardComponent>;
  let component: SubscriptionCardComponent;
  let router: Router;

  const nextcloudProduct: NextcloudProduct = {
    productID: 'nc-1',
    name: 'Nextcloud Basic',
    storageAmount: 2,
    storageUnit: 'TB',
    trialDays: 14,
    pricePerMonth: 999, // stored as cents
  };

  const synologyProduct: SynologyProduct = {
    productID: 'syn-1',
    name: 'DS920+',
    storageAmount: 4,
    storageUnit: 'TB',
    trialDays: 30,
    pricePerMonth: 1499,
  };

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [SubscriptionCardComponent],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  }

  describe('with no product bound', () => {
    beforeEach(async () => {
      await setup();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('renders nothing (no mat-card in the DOM)', () => {
      const card = fixture.nativeElement.querySelector('mat-card');
      expect(card).toBeNull();
    });

    it('exposes empty/zero defaults instead of throwing', () => {
      // Regression test for the "signal reference is always truthy" bug:
      // component.nextcloudProduct != undefined used to be true even when
      // unset, causing `.name` to be read off `undefined`.
      expect(component.name()).toBe('');
      expect(component.productID()).toBe('');
      expect(component.storageAmount()).toBe(0);
      expect(component.storageUnit()).toBe('');
      expect(component.trialDays()).toBe(0);
      expect(component.pricePerMonth()).toBe(0);
    });
  });

  describe('with only a synologyProduct bound', () => {
    beforeEach(async () => {
      await setup();
      fixture.componentRef.setInput('synologyProduct', synologyProduct);
      fixture.detectChanges();
    });

    it('should create without throwing', () => {
      // This is the exact scenario that crashed before the fix:
      // synologyProduct set, nextcloudProduct left unset.
      expect(component).toBeTruthy();
    });

    it('reads all fields from the synology product, not the nextcloud one', () => {
      expect(component.name()).toBe(synologyProduct.name);
      expect(component.productID()).toBe(synologyProduct.productID);
      expect(component.storageAmount()).toBe(synologyProduct.storageAmount);
      expect(component.storageUnit()).toBe(synologyProduct.storageUnit);
      expect(component.trialDays()).toBe(synologyProduct.trialDays);
    });

    it('renders the product name in the card title', () => {
      const title = fixture.nativeElement.querySelector('mat-card-title');
      expect(title.textContent.trim()).toBe(synologyProduct.name);
    });

    it('converts pricePerMonth from cents to whole currency units', () => {
      expect(component.pricePerMonth()).toBe(synologyProduct.pricePerMonth / 100);
    });
  });

  describe('with only a nextcloudProduct bound', () => {
    beforeEach(async () => {
      await setup();
      fixture.componentRef.setInput('nextcloudProduct', nextcloudProduct);
      fixture.detectChanges();
    });

    it('reads all fields from the nextcloud product', () => {
      expect(component.name()).toBe(nextcloudProduct.name);
      expect(component.productID()).toBe(nextcloudProduct.productID);
      expect(component.storageAmount()).toBe(nextcloudProduct.storageAmount);
      expect(component.storageUnit()).toBe(nextcloudProduct.storageUnit);
      expect(component.trialDays()).toBe(nextcloudProduct.trialDays);
    });
  });

  describe('trial messaging', () => {
    beforeEach(async () => {
      await setup();
      fixture.componentRef.setInput('synologyProduct', synologyProduct);
      fixture.detectChanges();
    });

    it('shows the trial as available when quantity is below 2', () => {
      expect(component.quantity()).toBe(1);
      expect(component.isTrialIncluded()).toBe(true);

      const strikethrough = fixture.nativeElement.querySelector('.no-trial');
      expect(strikethrough).toBeNull();
    });

    it('strikes through the trial once quantity reaches 2', async () => {
      component.quantityComponent()!.setQuantity(2);
      await fixture.whenStable();

      expect(component.isTrialIncluded()).toBe(false);

      const strikethrough = fixture.nativeElement.querySelector('.no-trial');
      expect(strikethrough).not.toBeNull();
    });
  });

  describe('pricing with quantity', () => {
    beforeEach(async () => {
      await setup();
      fixture.componentRef.setInput('synologyProduct', synologyProduct);
      fixture.detectChanges();
    });

    it('multiplies price per month by quantity', async () => {
      component.quantityComponent()!.setQuantity(3);
      await fixture.whenStable();

      const expectedTotal = (synologyProduct.pricePerMonth / 100) * 3;
      expect(component.pricePerMonth() * component.quantity()).toBe(expectedTotal);
    });

    it('multiplies storage amount by quantity', async () => {
      component.quantityComponent()!.setQuantity(3);
      await fixture.whenStable();

      expect(component.storageAmount() * component.quantity()).toBe(synologyProduct.storageAmount * 3);
    });
  });

  describe('openCheckoutIntegration()', () => {
    beforeEach(async () => {
      await setup();
      fixture.componentRef.setInput('synologyProduct', synologyProduct);
      fixture.detectChanges();
    });

    it('navigates to /checkout with the productID and quantity', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.openCheckoutIntegration();

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout'], {
        queryParams: {
          productID: synologyProduct.productID,
          quantity: 1,
        },
      });
    });

    it('reflects the current quantity, not just the default', async () => {
      component.quantityComponent()!.setQuantity(5);
      await fixture.whenStable();

      const navigateSpy = vi.spyOn(router, 'navigate');
      component.openCheckoutIntegration();

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout'], {
        queryParams: {
          productID: synologyProduct.productID,
          quantity: 5,
        },
      });
    });
  });
});