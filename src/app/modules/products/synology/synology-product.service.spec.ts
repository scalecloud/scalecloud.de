import { TestBed } from '@angular/core/testing';
import { SynologyProductService } from './synology-product.service';

describe('ProductService', () => {
  let service: SynologyProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynologyProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
