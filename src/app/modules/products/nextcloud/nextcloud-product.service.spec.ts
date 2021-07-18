import { TestBed } from '@angular/core/testing';
import { NextcloudProductService } from './nextcloud-product.service';

describe('ProductService', () => {
  let service: NextcloudProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextcloudProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
