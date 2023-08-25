import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChangedSucceededComponent } from './payment-changed-succeeded.component';

describe('PaymentChangedSucceededComponent', () => {
  let component: PaymentChangedSucceededComponent;
  let fixture: ComponentFixture<PaymentChangedSucceededComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentChangedSucceededComponent]
    });
    fixture = TestBed.createComponent(PaymentChangedSucceededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
