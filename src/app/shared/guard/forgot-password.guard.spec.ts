import { TestBed } from '@angular/core/testing';

import { ForgotPasswordGuard } from './forgot-password.guard';

describe('ForgotPasswordGuard', () => {
  let guard: ForgotPasswordGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ForgotPasswordGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
