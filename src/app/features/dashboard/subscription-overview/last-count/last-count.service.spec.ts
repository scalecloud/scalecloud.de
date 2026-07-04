import { TestBed } from '@angular/core/testing';

import { LastCountService } from './last-count.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LastCountService', () => {
  let service: LastCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
