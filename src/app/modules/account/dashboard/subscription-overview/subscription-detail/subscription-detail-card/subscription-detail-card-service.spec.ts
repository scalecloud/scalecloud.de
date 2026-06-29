import { TestBed } from '@angular/core/testing';

import { SubscriptionDetailCardService } from './subscription-detail-card-service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SubscriptionDetailCardService', () => {
  let service: SubscriptionDetailCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionDetailCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
