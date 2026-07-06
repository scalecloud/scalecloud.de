import { TestBed } from '@angular/core/testing';

import { LastCountStore } from './last-count-store';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LastCountStore', () => {
  let lastCountStore: LastCountStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    lastCountStore = TestBed.inject(LastCountStore);
  });

  it('should be created', () => {
    expect(lastCountStore).toBeTruthy();
  });
});
