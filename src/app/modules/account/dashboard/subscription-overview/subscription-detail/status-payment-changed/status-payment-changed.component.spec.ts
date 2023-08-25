import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPaymentChangedComponent } from './status-payment-changed.component';

describe('StatusPaymentChangedComponent', () => {
  let component: StatusPaymentChangedComponent;
  let fixture: ComponentFixture<StatusPaymentChangedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusPaymentChangedComponent]
    });
    fixture = TestBed.createComponent(StatusPaymentChangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
