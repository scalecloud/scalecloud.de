import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripePaymentElementComponent } from './stripe-payment-element.component';

describe('StripePaymentElementComponent', () => {
  let component: StripePaymentElementComponent;
  let fixture: ComponentFixture<StripePaymentElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StripePaymentElementComponent]
    });
    fixture = TestBed.createComponent(StripePaymentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
