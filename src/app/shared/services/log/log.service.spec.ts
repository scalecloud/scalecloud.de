import { TestBed } from '@angular/core/testing';

import { LogService } from './log.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
