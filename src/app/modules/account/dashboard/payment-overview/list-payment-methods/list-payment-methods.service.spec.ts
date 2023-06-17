import { TestBed } from '@angular/core/testing';

import { ListPaymentMethodsService } from './list-payment-methods.service';

describe('ListPaymentMethodsService', () => {
  let service: ListPaymentMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListPaymentMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
