import { TestBed } from '@angular/core/testing';

import { LastCountService } from './last-count.service';

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
