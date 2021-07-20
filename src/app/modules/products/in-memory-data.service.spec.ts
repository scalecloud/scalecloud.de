import { TestBed } from '@angular/core/testing';

import { InMemoryDataService } from './in-memory-data.service';
import { NEXTCLOUDPRODUCTS } from './nextcloud/mock-nextcloud-products';
import { SYNOLOGYPRODUCTS } from './synology/mock-synology-products';

describe('InMemoryDataService', () => {
  let service: InMemoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

  });

  it('genId', () => {
    expect(service.genId(NEXTCLOUDPRODUCTS)).toBeGreaterThan(0);
  });

  it('createn nextcloudproducts', () => {
    expect(service.createDb().nextcloudproducts).toBe(NEXTCLOUDPRODUCTS)
  });

  it('create synologyproducts', () => {
    expect(service.createDb().synologyproducts).toBe(SYNOLOGYPRODUCTS)
  });

});
