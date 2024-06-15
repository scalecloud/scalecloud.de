import { TestBed } from '@angular/core/testing';

import { RemoveSeatService } from './remove-seat.service';

describe('RemoveSeatService', () => {
  let service: RemoveSeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveSeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
