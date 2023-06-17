import { TestBed } from '@angular/core/testing';

import { SubscriptionDetailService } from './subscription-detail.service';

describe('SubscriptionDetailService', () => {
  let service: SubscriptionDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
