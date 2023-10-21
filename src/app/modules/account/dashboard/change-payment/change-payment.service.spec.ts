import { TestBed } from '@angular/core/testing';

import { ChangePaymentService } from './change-payment.service';

describe('ChangePaymentService', () => {
  let service: ChangePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
