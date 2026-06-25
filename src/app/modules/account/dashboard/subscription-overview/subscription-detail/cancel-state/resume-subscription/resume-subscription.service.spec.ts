import { TestBed } from '@angular/core/testing';

import { ResumeSubscriptionService } from './resume-subscription.service';
import { describe, beforeEach, it, expect } from 'vitest';

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
