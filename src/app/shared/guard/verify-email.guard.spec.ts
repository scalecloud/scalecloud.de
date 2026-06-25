import { TestBed } from '@angular/core/testing';

import { VerifyEMailGuard } from './verify-email.guard';
import { describe, beforeEach, it, expect } from 'vitest';

describe('VerifyEMailGuard', () => {
  let guard: VerifyEMailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifyEMailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
