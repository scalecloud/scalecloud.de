import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChangedProcessingComponent } from './payment-changed-processing.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('PaymentChangedProcessingComponent', () => {
  let component: PaymentChangedProcessingComponent;
  let fixture: ComponentFixture<PaymentChangedProcessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PaymentChangedProcessingComponent]
});
    fixture = TestBed.createComponent(PaymentChangedProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
