import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressDetailComponent } from './billing-address-detail.component';

describe('BillingAddressDetailComponent', () => {
  let component: BillingAddressDetailComponent;
  let fixture: ComponentFixture<BillingAddressDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingAddressDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingAddressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
