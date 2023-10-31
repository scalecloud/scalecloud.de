import { TestBed } from '@angular/core/testing';

import { PaymentMethodOverviewService } from './payment-method-overview.service';

describe('PaymentMethodOverviewService', () => {
  let service: PaymentMethodOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentMethodOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
