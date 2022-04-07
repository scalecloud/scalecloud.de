import { TestBed } from '@angular/core/testing';

import { VerifyEMailGuard } from './verify-email.guard';

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
