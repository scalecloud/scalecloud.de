import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiresPaymentMethodComponent } from './requires-payment-method.component';

describe('RequiresPaymentMethodComponent', () => {
  let component: RequiresPaymentMethodComponent;
  let fixture: ComponentFixture<RequiresPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequiresPaymentMethodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequiresPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
