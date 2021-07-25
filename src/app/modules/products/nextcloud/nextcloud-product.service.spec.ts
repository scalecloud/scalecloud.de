import { TestBed } from '@angular/core/testing';
import { NextcloudProductService } from './nextcloud-product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NextcloudProductService', () => {
  let service: NextcloudProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NextcloudProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
