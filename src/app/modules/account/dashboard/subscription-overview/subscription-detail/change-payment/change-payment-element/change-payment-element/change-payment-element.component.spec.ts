import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePaymentElementComponent } from './change-payment-element.component';

describe('ChangePaymentElementComponent', () => {
  let component: ChangePaymentElementComponent;
  let fixture: ComponentFixture<ChangePaymentElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePaymentElementComponent]
    });
    fixture = TestBed.createComponent(ChangePaymentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
