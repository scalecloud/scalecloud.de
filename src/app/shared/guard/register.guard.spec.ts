import { TestBed } from '@angular/core/testing';

import { RegisterGuard } from './register.guard';
import { describe, beforeEach, it, expect } from 'vitest';

describe('RegisterGuard', () => {
  let guard: RegisterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RegisterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
