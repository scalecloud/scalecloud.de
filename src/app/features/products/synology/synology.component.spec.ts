import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { SynologyComponent } from './synology.component';
import { ProductService } from '../product/product.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { SynologyProduct } from './synology-product';

describe('SynologyComponent', () => {
  let fixture: ComponentFixture<SynologyComponent>;
  let component: SynologyComponent;
  let productServiceMock: { getProductTiers: ReturnType<typeof vi.fn> };

  const mockProducts: SynologyProduct[] = [
    { productID: '1', name: 'DS920+', storageAmount: 4, storageUnit: 'TB', trialDays: 14, pricePerMonth: 9.99 },
    { productID: '2', name: 'DS923+', storageAmount: 8, storageUnit: 'TB', trialDays: 14, pricePerMonth: 14.99 }
  ];

  beforeEach(async () => {
    productServiceMock = {
      // Defaults to a happy-path response; individual tests can override with mockReturnValue.
      getProductTiers: vi.fn().mockReturnValue(of({ productTiers: mockProducts }))
    };

    await TestBed.configureTestingModule({
      // SynologyComponent is standalone and already declares its own template
      // dependencies (TitelCardComponent, SubscriptionCardComponent, etc.) via
      // its `imports` array, so nothing else needs to be imported here.
      imports: [SynologyComponent],
      providers: [
        // Some rendered child (e.g. TitelCardComponent / SubscriptionCardComponent)
        // injects ActivatedRoute or uses a routerLink-style directive. An empty
        // router config is enough to satisfy that DI requirement; nothing here
        // reads actual route params, so no ActivatedRoute stub is needed.
        provideRouter([]),
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SynologyComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    await fixture.whenStable();

    expect(component).toBeTruthy();
  });

  it('should request the Synology product tiers on init', async () => {
    await fixture.whenStable();

    expect(productServiceMock.getProductTiers).toHaveBeenCalledWith(component.productType);
  });

  it('should move to Success and expose the returned products once the request resolves', async () => {
    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    expect(component.synologyProducts()).toEqual(mockProducts);
  });

  it('should render one subscription card per product on success', async () => {
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('app-subscription-card');
    expect(cards.length).toBe(mockProducts.length);
  });

  it('should move to Error when the request fails', async () => {
    productServiceMock.getProductTiers.mockReturnValue(throwError(() => new Error('boom')));

    await fixture.whenStable();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    const failedCards = fixture.nativeElement.querySelectorAll('app-loading-failed');
    expect(failedCards.length).toBe(4);
  });
});