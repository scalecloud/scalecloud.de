import { Component, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { CheckoutComponent } from './checkout.component';
import { CheckoutDetailsComponent } from './checkout-details/checkout-details.component';
import { PaymentOverviewComponent } from 'src/app/modules/account/dashboard/payment-overview/payment-overview.component';
import { CheckoutCreateSubscriptionRequest } from './checkout-create-subscription';
import { LogService } from 'src/app/core/logging/log.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CheckoutSubscriptionService } from './payment-element/checkout-subscription.service';

// ─── Stubs for the child components CheckoutComponent renders ─────────────────
// CheckoutDetailsComponent and PaymentOverviewComponent each pull in their own
// large dependency trees (HttpClient, ActivatedRoute -> AuthService ->
// ReturnUrlService, etc.) that have nothing to do with what CheckoutComponent
// itself is responsible for. Stubbing them out keeps this a unit test of
// CheckoutComponent rather than a full integration test of the whole checkout
// page, and avoids needing to recreate that entire dependency graph here.

@Component({ selector: 'app-payment-overview', template: '' })
class MockPaymentOverviewComponent {}

@Component({ selector: 'app-checkout-details', template: '' })
class MockCheckoutDetailsComponent {
  // Must match the real output's name/type so the (startSubscriptionEvent)
  // binding in checkout.component.html still resolves against this stub.
  readonly startSubscriptionEvent = output<CheckoutCreateSubscriptionRequest>();
}

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideRouter([]),
        { provide: LogService, useValue: { error: vi.fn() } },
        { provide: SnackBarService, useValue: { info: vi.fn(), error: vi.fn() } },
        { provide: AuthService, useValue: { waitForAuth: vi.fn(() => Promise.resolve()) } },
        { provide: CheckoutSubscriptionService, useValue: { createCheckoutSubscription: vi.fn() } },
      ],
    })
      .overrideComponent(CheckoutComponent, {
        remove: { imports: [PaymentOverviewComponent, CheckoutDetailsComponent] },
        add: { imports: [MockPaymentOverviewComponent, MockCheckoutDetailsComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});