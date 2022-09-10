import { TestBed } from '@angular/core/testing';

import { StripeKeyService } from './stripe-key.service';

describe('StripeKeyService', () => {
  let service: StripeKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
