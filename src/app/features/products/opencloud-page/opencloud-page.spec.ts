import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { OpenCloudPage } from './opencloud-page';
import { ProductClient } from '../product-client/product-client';
import { ProductType } from '../product-model';
import { ServiceStatus } from 'src/app/shared/client-status';
import { Log } from 'src/app/core/logging/log';

describe('OpenCloudPage', () => {
  let fixture: ComponentFixture<OpenCloudPage>;
  let component: OpenCloudPage;
  let productClientMock: { getOpenCloudProduct: ReturnType<typeof vi.fn> };
  let router: Router;

  const product = {
    productID: 'opencloud',
    productType: ProductType.OpenCloud,
    name: 'OpenCloud',
    storageAmount: 1,
    storageUnit: 'TB',
    trialDays: 30,
    pricePerMonth: 900,
  };

  beforeEach(async () => {
    productClientMock = {
      getOpenCloudProduct: vi.fn().mockReturnValue(of(product)),
    };
    await TestBed.configureTestingModule({
      imports: [OpenCloudPage],
      providers: [
        provideRouter([]),
        { provide: Log, useValue: { error: vi.fn() } },
        { provide: ProductClient, useValue: productClientMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(OpenCloudPage);
    component = fixture.componentInstance;
  });

  it('requests and displays the OpenCloud product', async () => {
    await fixture.whenStable();

    expect(productClientMock.getOpenCloudProduct).toHaveBeenCalledWith();
    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    expect(component.product()).toEqual(product);
    expect(fixture.nativeElement.querySelector('.order-summary')).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.summary-detail')?.textContent).not.toContain('€');
    expect((fixture.nativeElement as HTMLElement).querySelector('.summary-price strong')?.textContent).toContain('€9.00');
  });

  it('updates total storage and price when allocation amounts change', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.add-allocation-actions button:first-child')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.quantity()).toBe(2);
    expect(fixture.nativeElement.querySelector('.storage-number')?.textContent.trim()).toBe('2');
    expect(component.totalPrice()).toBe(18);
  });

  it('only offers a trial for one unit when the backend returns trial days', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isTrialAvailable()).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('.trial-note')?.textContent).toContain('30-day trial');

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.add-allocation-actions button:first-child')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isTrialAvailable()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('.trial-note')?.textContent).toContain('only available when buying one unit');
  });

  it('does not offer a trial when the backend returns zero trial days', async () => {
    await fixture.whenStable();
    component.product.set({ ...product, trialDays: 0 });
    fixture.detectChanges();

    expect(component.isTrialAvailable()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('.trial-note')?.textContent).toContain('No free trial is available');
  });

  it('adds users and spaces to the total purchase quantity', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    page.querySelectorAll<HTMLButtonElement>('.add-allocation-actions button')[0]?.click();
    page.querySelectorAll<HTMLButtonElement>('.add-allocation-actions button')[1]?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.quantity()).toBe(3);
    expect(component.totalStorage()).toBe(3);
    expect(page.querySelectorAll('.allocation-row')).toHaveLength(3);
  });

  it('updates and removes an allocation independently', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    page.querySelectorAll<HTMLButtonElement>('.add-allocation-actions button')[0]?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    page.querySelector<HTMLButtonElement>('[aria-label="Add one TB to Person 1"]')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.quantity()).toBe(3);
    page.querySelector<HTMLButtonElement>('[aria-label="Remove Person 1"]')?.click();
    await fixture.whenStable();

    expect(component.quantity()).toBe(1);
    expect(page.querySelectorAll('.allocation-row')).toHaveLength(1);
  });

  it('passes the sum of allocation amounts to checkout', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    page.querySelectorAll<HTMLButtonElement>('.add-allocation-actions button')[0]?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    page.querySelector<HTMLButtonElement>('.checkout-button')?.click();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/checkout'], {
      queryParams: { productID: 'opencloud', quantity: 2 },
    });
  });

  it('fails visibly when the product request fails', async () => {
    productClientMock.getOpenCloudProduct.mockReturnValue(throwError(() => new Error('boom')));

    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });
});