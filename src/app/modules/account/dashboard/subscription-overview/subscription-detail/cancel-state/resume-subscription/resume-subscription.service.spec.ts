import { TestBed } from '@angular/core/testing';

import { ResumeSubscriptionService } from './resume-subscription.service';

describe('ResumeSubscriptionService', () => {
  let service: ResumeSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
