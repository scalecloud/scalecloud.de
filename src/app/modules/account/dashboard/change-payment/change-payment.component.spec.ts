import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePaymentComponent } from './change-payment.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ChangePaymentComponent', () => {
  let component: ChangePaymentComponent;
  let fixture: ComponentFixture<ChangePaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePaymentComponent]
    });
    fixture = TestBed.createComponent(ChangePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
