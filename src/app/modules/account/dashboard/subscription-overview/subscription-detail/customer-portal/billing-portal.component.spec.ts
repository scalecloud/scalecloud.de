import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingPortalComponent } from './billing-portal.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('BillingPortalComponent', () => {
  let component: BillingPortalComponent;
  let fixture: ComponentFixture<BillingPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BillingPortalComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
