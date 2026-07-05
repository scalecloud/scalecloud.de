import { TestBed } from '@angular/core/testing';

import { Log } from './log';
import { describe, beforeEach, it, expect } from 'vitest';

describe('Log', () => {
  let service: Log;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Log);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
