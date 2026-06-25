import { TestBed } from '@angular/core/testing';

import { SeatsService } from './seats.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SeatsService', () => {
  let service: SeatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
