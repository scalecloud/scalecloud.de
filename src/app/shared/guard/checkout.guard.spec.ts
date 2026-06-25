import { TestBed } from '@angular/core/testing';

import { CheckoutGuard } from './checkout.guard';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CheckoutGuard', () => {
  let guard: CheckoutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckoutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
