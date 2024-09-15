import { TestBed } from '@angular/core/testing';

import { CancelStateService } from './cancel-state.service';

describe('CancelStateService', () => {
  let service: CancelStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancelStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
