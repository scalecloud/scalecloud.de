import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChangedProcessingComponent } from './payment-changed-processing.component';

describe('PaymentChangedProcessingComponent', () => {
  let component: PaymentChangedProcessingComponent;
  let fixture: ComponentFixture<PaymentChangedProcessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentChangedProcessingComponent]
    });
    fixture = TestBed.createComponent(PaymentChangedProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
