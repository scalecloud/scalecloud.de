import { TestBed } from '@angular/core/testing';

import { SubscriptionPaymentMethodService } from './subscription-payment-method.service';

describe('SubscriptionPaymentMethodService', () => {
  let service: SubscriptionPaymentMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionPaymentMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
