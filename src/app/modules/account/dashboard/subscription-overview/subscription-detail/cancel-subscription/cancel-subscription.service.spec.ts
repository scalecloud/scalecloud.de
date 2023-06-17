import { TestBed } from '@angular/core/testing';

import { CancelSubscriptionService } from './cancel-subscription.service';

describe('CancelSubscriptionService', () => {
  let service: CancelSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancelSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
