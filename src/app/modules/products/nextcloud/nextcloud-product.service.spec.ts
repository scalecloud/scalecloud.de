import { TestBed } from '@angular/core/testing';
import { NextcloudProductService } from './nextcloud-product.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NextcloudProductService', () => {
  let service: NextcloudProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(NextcloudProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
