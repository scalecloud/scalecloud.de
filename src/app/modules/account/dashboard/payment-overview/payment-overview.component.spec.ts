import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOverviewComponent } from './payment-overview.component';

describe('PaymentOverviewComponent', () => {
  let component: PaymentOverviewComponent;
  let fixture: ComponentFixture<PaymentOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentOverviewComponent]
    });
    fixture = TestBed.createComponent(PaymentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
