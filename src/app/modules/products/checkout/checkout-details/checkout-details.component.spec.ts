import { Component, forwardRef, signal, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Observable, of, throwError, Subject } from 'rxjs';

import { CheckoutDetailsComponent } from './checkout-details.component';
import { CheckoutProductService } from './checkout-product.service';
import { CheckoutProductReply } from './checkout-product';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { QuantityComponent } from '../../subscription-card/quantity/quantity.component';
import { LoadingFailedComponent } from '../../../../shared/components/loading-failed/loading-failed.component';
import { ServiceStatus } from 'src/app/shared/services/service-status';

// ─── Stubs for child components rendered by the template ──────────────────────
// We don't have the real QuantityComponent / LoadingFailedComponent source, so
// these stand-ins expose the minimal public surface CheckoutDetailsComponent
// actually depends on (selector + getQuantity()).
//
// IMPORTANT: matching the selector ('app-quantity') is not enough on its own.
// `viewChild(QuantityComponent)` in the component under test queries by the
// *class* QuantityComponent, not by selector - a different class rendered at
// the same selector will never satisfy that query, no matter how many
// change-detection cycles run. The `providers: [{ provide: QuantityComponent,
// useExisting: ... }]` below is what makes the node injector resolve
// `QuantityComponent` to this mock instance. If the real QuantityComponent's
// internal `getQuantity()` does NOT read a signal, computed `quantity` in the
// component under test won't react to in-place changes - share the real file if
// that's the case and these stubs/tests can be tightened up.

@Component({
  selector: 'app-quantity',
  template: '',
  providers: [{ provide: QuantityComponent, useExisting: forwardRef(() => MockQuantityComponent) }],
})
class MockQuantityComponent {
  private readonly quantitySignal = signal(1);
  getQuantity(): number {
    return this.quantitySignal();
  }
  setQuantity(value: number): void {
    this.quantitySignal.set(value);
  }
}

@Component({ selector: 'app-loading-failed', template: '<div>loading-failed-stub</div>' })
class MockLoadingFailedComponent {}

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeReply(overrides: Partial<CheckoutProductReply> = {}): CheckoutProductReply {
  return {
    productID: 'prod_123',
    name: 'Pro Plan',
    storageAmount: 100,
    storageUnit: 'GB',
    trialDays: 14,
    pricePerMonth: 1999,
    currency: 'USD',
    has_valid_payment_method: true,
    ...overrides,
  };
}

function makeActivatedRouteStub(productID: string | null = 'prod_123'): {
  snapshot: { queryParamMap: ParamMap };
  queryParamMap: Observable<ParamMap>;
} {
  const paramMap = convertToParamMap(productID !== null ? { productID } : {});
  return {
    snapshot: { queryParamMap: paramMap },
    queryParamMap: of(paramMap),
  };
}

// ─── Setup ──────────────────────────────────────────────────────────────────

describe('CheckoutDetailsComponent', () => {
  let component: CheckoutDetailsComponent;
  let fixture: ComponentFixture<CheckoutDetailsComponent>;

  const checkoutProductService = { getCheckoutProduct: vi.fn() };
  const authService = { waitForAuth: vi.fn(() => Promise.resolve()) };
  const logService = { error: vi.fn() };

  // `settle: false` is for tests that intentionally leave the product request
  // pending (e.g. an open Subject that never emits). In those cases the
  // resource never resolves, the app never reaches a "stable" state, and
  // `fixture.whenStable()` would hang until the test times out.
  async function setup(activatedRouteStub = makeActivatedRouteStub(), { settle = true }: { settle?: boolean } = {}): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [CheckoutDetailsComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: CheckoutProductService, useValue: checkoutProductService },
        { provide: AuthService, useValue: authService },
        { provide: LogService, useValue: logService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .overrideComponent(CheckoutDetailsComponent, {
        remove: { imports: [QuantityComponent, LoadingFailedComponent] },
        add: { imports: [MockQuantityComponent, MockLoadingFailedComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CheckoutDetailsComponent);
    component = fixture.componentInstance;

    // Zoneless fixtures don't render on creation - without this first
    // detectChanges() the template (and anything inside an @if, like
    // <app-quantity> in the Success block) never mounts, so
    // viewChild(QuantityComponent) stays undefined.
    fixture.detectChanges();

    if (settle) {
      // Lets the resource's async loader (waitForAuth + the HTTP call) finish
      // and lets the scheduler re-render the Loading/Success/Error block.
      await fixture.whenStable();
    }
  }

  function getMockQuantityComponent(): MockQuantityComponent {
    return component.quantityComponent() as unknown as MockQuantityComponent;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    authService.waitForAuth.mockResolvedValue(undefined);
  });

  // ─── Creation & query param handling ─────────────────────────────────────────

  it('should create', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply()));
    await setup();
    expect(component).toBeTruthy();
  });

  it('should be in an error state and log when productID is missing from the query params', async () => {
    await setup(makeActivatedRouteStub(null));

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logService.error).toHaveBeenCalledWith('Could not determine productID from the query params.');
    expect(checkoutProductService.getCheckoutProduct).not.toHaveBeenCalled();
  });

  it('should wait for auth and request the product for the productID in the query params', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply()));
    await setup(makeActivatedRouteStub('prod_456'));

    expect(authService.waitForAuth).toHaveBeenCalled();
    expect(checkoutProductService.getCheckoutProduct).toHaveBeenCalledWith({ productID: 'prod_456' });
  });

  // ─── Success state ────────────────────────────────────────────────────────────

  it('should be in a success state and expose the product details after loading', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply({ name: 'Pro Plan', currency: 'EUR' })));
    await setup();

    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    expect(component.name()).toBe('Pro Plan');
    expect(component.currency()).toBe('EUR');
  });

  it('should default hasPaymentMethod to false when the field is absent from the reply', async () => {
    const reply = makeReply();
    delete (reply as Partial<CheckoutProductReply>).has_valid_payment_method;
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(reply));
    await setup();

    expect(component.hasPaymentMethod()).toBe(false);
  });

  it('should scale the storage amount by the selected quantity', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply({ storageAmount: 100 })));
    await setup();

    getMockQuantityComponent().setQuantity(3);
    await fixture.whenStable();

    expect(component.storageAmount()).toBe(300);
  });

  it('should include a trial only when quantity is below 2 and trial days are available', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply({ trialDays: 14 })));
    await setup();

    getMockQuantityComponent().setQuantity(1);
    await fixture.whenStable();
    expect(component.isTrialIncluded()).toBe(true);

    getMockQuantityComponent().setQuantity(2);
    await fixture.whenStable();
    expect(component.isTrialIncluded()).toBe(false);
  });

  it('should not include a trial when the product has no trial days', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply({ trialDays: 0 })));
    await setup();

    expect(component.isTrialIncluded()).toBe(false);
  });

  it('should compute a zero raw price when pricePerMonth is zero', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply({ pricePerMonth: 0 })));
    await setup();

    expect(component.rawPricePerMonth()).toBe(0);
  });

  it('should compute the raw monthly price scaled by quantity', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply({ pricePerMonth: 1999 })));
    await setup();

    getMockQuantityComponent().setQuantity(2);
    await fixture.whenStable();

    expect(component.rawPricePerMonth()).toBeCloseTo(39.98);
  });

  // ─── Error state ──────────────────────────────────────────────────────────────

  it('should be in an error state when the product request fails', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(throwError(() => new Error('Network error')));
    await setup();

    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  // ─── startSubscription ──────────────────────────────────────────────────────

  it('should emit startSubscriptionEvent with the productID and selected quantity', async () => {
    checkoutProductService.getCheckoutProduct.mockReturnValue(of(makeReply({ productID: 'prod_123' })));
    await setup();

    getMockQuantityComponent().setQuantity(4);
    await fixture.whenStable();

    const emitSpy = vi.fn();
    component.startSubscriptionEvent.subscribe(emitSpy);

    component.startSubscription();

    expect(emitSpy).toHaveBeenCalledWith({ productID: 'prod_123', quantity: 4 });
  });

  it('should not emit and should log an error when starting a subscription before the product has loaded', async () => {
    const subject = new Subject<CheckoutProductReply>();
    checkoutProductService.getCheckoutProduct.mockReturnValue(subject.asObservable());
    // The subject never emits, so the resource stays "loading" forever -
    // don't wait for stability or this hangs until the test times out.
    await setup(makeActivatedRouteStub(), { settle: false });

    const emitSpy = vi.fn();
    component.startSubscriptionEvent.subscribe(emitSpy);

    component.startSubscription();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(logService.error).toHaveBeenCalledWith('Cannot start subscription without a loaded product.');
  });
});