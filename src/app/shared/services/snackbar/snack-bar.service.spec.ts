import { TestBed } from '@angular/core/testing';

import { SnackBarService } from './snack-bar.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SnackBarService', () => {
  let service: SnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
