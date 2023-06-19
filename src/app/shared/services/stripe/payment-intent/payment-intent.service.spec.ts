import { TestBed } from '@angular/core/testing';

import { PaymentIntentService } from './payment-intent.service';

describe('PaymentIntentService', () => {
  let service: PaymentIntentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentIntentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
