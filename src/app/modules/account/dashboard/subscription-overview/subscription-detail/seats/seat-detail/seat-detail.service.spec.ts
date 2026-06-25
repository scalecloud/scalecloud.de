import { TestBed } from '@angular/core/testing';

import { SeatDetailService } from './seat-detail.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SeatDetailService', () => {
  let service: SeatDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
