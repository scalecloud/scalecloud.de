import { TestBed } from '@angular/core/testing';

import { RemoveUserService } from './remove-user.service';

describe('RemoveUserService', () => {
  let service: RemoveUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
