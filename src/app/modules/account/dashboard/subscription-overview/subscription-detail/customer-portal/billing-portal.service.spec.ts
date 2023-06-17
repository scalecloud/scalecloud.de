import { TestBed } from '@angular/core/testing';

import { BillingPortalService } from './billing-portal.service';

describe('BillingPortalService', () => {
  let service: BillingPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
