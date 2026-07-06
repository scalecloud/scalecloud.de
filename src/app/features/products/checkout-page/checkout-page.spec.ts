import { Component, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { CheckoutPage } from './checkout-page';
import { CheckoutDetails } from './checkout-details/checkout-details';
import { CheckoutCreateSubscriptionRequest } from './checkout-create-subscription';
import { CheckoutSubscriptionClient } from './checkout-payment/checkout-subscription-client';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { PaymentMethodOverview } from '../../dashboard-page/payment-method-overview/payment-method-overview';

// ─── Stubs for the child components CheckoutComponent renders ─────────────────
// CheckoutDetailsComponent and PaymentOverviewComponent each pull in their own
// large dependency trees (HttpClient, ActivatedRoute -> Auth ->
// ReturnUrl, etc.) that have nothing to do with what CheckoutComponent
// itself is responsible for. Stubbing them out keeps this a unit test of
// CheckoutComponent rather than a full integration test of the whole checkout
// page, and avoids needing to recreate that entire dependency graph here.

@Component({ selector: 'app-payment-method-overview', template: '' })
class MockPaymentMethodOverviewComponent {}

@Component({ selector: 'app-checkout-details', template: '' })
class MockCheckoutDetailsComponent {
  // Must match the real output's name/type so the (startSubscriptionEvent)
  // binding in checkout.component.html still resolves against this stub.
  readonly startSubscriptionEvent = output<CheckoutCreateSubscriptionRequest>();
}

describe('CheckoutPage', () => {
  let component: CheckoutPage;
  let fixture: ComponentFixture<CheckoutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPage],
      providers: [
        provideRouter([]),
        { provide: Log, useValue: { error: vi.fn() } },
        { provide: SnackBar, useValue: { info: vi.fn(), error: vi.fn() } },
        { provide: Auth, useValue: { waitForAuth: vi.fn(() => Promise.resolve()) } },
        { provide: CheckoutSubscriptionClient, useValue: { createCheckoutSubscription: vi.fn() } },
      ],
    })
      .overrideComponent(CheckoutPage, {
        remove: { imports: [PaymentMethodOverview, CheckoutDetails] },
        add: { imports: [MockPaymentMethodOverviewComponent, MockCheckoutDetailsComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CheckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});