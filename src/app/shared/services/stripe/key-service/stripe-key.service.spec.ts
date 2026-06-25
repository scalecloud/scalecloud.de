import { TestBed } from '@angular/core/testing';

import { StripeKeyService } from './stripe-key.service';
import { describe, beforeEach, it, expect } from 'vitest';

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
