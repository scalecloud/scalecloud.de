import { TestBed } from '@angular/core/testing';

import { AddSeatService } from './add-seat.service';

describe('AddSeatService', () => {
  let service: AddSeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddSeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
