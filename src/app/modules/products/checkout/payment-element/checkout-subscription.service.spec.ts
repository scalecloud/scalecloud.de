import { TestBed } from '@angular/core/testing';

import { CheckoutSubscriptionService } from './checkout-subscription.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CheckoutSubscriptionService', () => {
  let service: CheckoutSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
