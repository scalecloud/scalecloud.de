import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDetailsComponent } from './checkout-details.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CheckoutDetailsComponent', () => {
  let component: CheckoutDetailsComponent;
  let fixture: ComponentFixture<CheckoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CheckoutDetailsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
