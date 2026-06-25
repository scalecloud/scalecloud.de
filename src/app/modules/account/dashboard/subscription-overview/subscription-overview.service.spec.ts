import { TestBed } from '@angular/core/testing';
import { SubscriptionOverviewService } from './subscription-overview.service';
import { describe, beforeEach, it, expect } from 'vitest';


describe('SubscriptionOverviewService', () => {
  let service: SubscriptionOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
