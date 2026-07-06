import { TestBed } from '@angular/core/testing';

import { Log } from './log';
import { describe, beforeEach, it, expect } from 'vitest';

describe('Log', () => {
  let log: Log;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    log = TestBed.inject(Log);
  });

  it('should be created', () => {
    expect(log).toBeTruthy();
  });
});
