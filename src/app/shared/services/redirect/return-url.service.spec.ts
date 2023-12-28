import { TestBed } from '@angular/core/testing';

import { ReturnUrlService } from './return-url.service';

describe('ReturnUrlService', () => {
  let service: ReturnUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
