import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverviewComponent } from './payment-overview.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('PaymentOverviewComponent', () => {
  let component: PaymentOverviewComponent;
  let fixture: ComponentFixture<PaymentOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PaymentOverviewComponent]
});
    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
