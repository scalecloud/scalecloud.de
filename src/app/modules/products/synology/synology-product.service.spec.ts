import { TestBed } from '@angular/core/testing';
import { SynologyProductService } from './synology-product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SynologyProductService', () => {
  let service: SynologyProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SynologyProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
