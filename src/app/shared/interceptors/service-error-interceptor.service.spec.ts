import { TestBed } from '@angular/core/testing';

import { ServiceErrorInterceptorService } from './service-error-interceptor.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ServiceErrorInterceptorService', () => {
  let service: ServiceErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceErrorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
