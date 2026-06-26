import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripePaymentElementComponent } from './stripe-payment-element.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('StripePaymentElementComponent', () => {
  let component: StripePaymentElementComponent;
  let fixture: ComponentFixture<StripePaymentElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StripePaymentElementComponent]
});
    fixture = TestBed.createComponent(StripePaymentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
