import { TestBed } from '@angular/core/testing';

import { SubscriptionDetailCardServiceService } from './subscription-detail-card-service.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SubscriptionDetailCardServiceService', () => {
  let service: SubscriptionDetailCardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionDetailCardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
