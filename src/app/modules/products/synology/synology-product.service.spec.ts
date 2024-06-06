import { TestBed } from '@angular/core/testing';
import { SynologyProductService } from './synology-product.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SynologyProductService', () => {
  let service: SynologyProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SynologyProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
