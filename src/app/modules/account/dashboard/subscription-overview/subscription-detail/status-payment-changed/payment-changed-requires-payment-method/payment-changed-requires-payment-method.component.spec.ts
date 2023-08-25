import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChangedRequiresPaymentMethodComponent } from './payment-changed-requires-payment-method.component';

describe('PaymentChangedRequiresPaymentMethodComponent', () => {
  let component: PaymentChangedRequiresPaymentMethodComponent;
  let fixture: ComponentFixture<PaymentChangedRequiresPaymentMethodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentChangedRequiresPaymentMethodComponent]
    });
    fixture = TestBed.createComponent(PaymentChangedRequiresPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
