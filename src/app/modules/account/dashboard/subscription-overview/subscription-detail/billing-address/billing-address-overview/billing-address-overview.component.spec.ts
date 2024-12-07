import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAddressOverviewComponent } from './billing-address-overview.component';

describe('BillingAddressOverviewComponent', () => {
  let component: BillingAddressOverviewComponent;
  let fixture: ComponentFixture<BillingAddressOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingAddressOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingAddressOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
