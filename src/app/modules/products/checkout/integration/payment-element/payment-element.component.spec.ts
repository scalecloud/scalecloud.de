import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentElementComponent } from './payment-element.component';

describe('PaymentElementComponent', () => {
  let component: PaymentElementComponent;
  let fixture: ComponentFixture<PaymentElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
