import { TestBed } from '@angular/core/testing';

import { CheckoutProductService } from './checkout-product.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CheckoutProductService', () => {
  let service: CheckoutProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
