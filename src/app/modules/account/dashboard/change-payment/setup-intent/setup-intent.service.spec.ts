import { TestBed } from '@angular/core/testing';

import { SetupIntentService } from './setup-intent.service';

describe('SetupIntentService', () => {
  let service: SetupIntentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetupIntentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
