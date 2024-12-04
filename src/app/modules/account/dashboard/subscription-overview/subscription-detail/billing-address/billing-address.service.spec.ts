import { TestBed } from '@angular/core/testing';

import { BillingAddressService } from './billing-address.service';

describe('BillingAddressService', () => {
  let service: BillingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
