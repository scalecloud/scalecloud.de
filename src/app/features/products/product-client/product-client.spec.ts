import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

import { ProductClient } from './product-client';
import { ProductTiersReply, ProductType } from '../product-model';
import { API_URL } from 'src/app/core/config/api-token';

describe('ProductClient', () => {
  const baseUrl = 'https://api.example.test';

  let service: ProductClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: baseUrl },
      ],
    });

    service = TestBed.inject(ProductClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Fails the test if any request went out that wasn't asserted on above,
    // e.g. an accidental duplicate call or a URL typo that "sort of" works.
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('GETs the tiers endpoint for the given product type', () => {
    const mockReply: ProductTiersReply = {
      productType: ProductType.Nextcloud,
      productTiers: [],
    };

    service.getProductTiers(ProductType.Nextcloud).subscribe(reply => {
      expect(reply).toEqual(mockReply);
    });

    const req = httpMock.expectOne(`${baseUrl}/product/tiers/nextcloud`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReply);
  });

  it('lowercases the product type when building the URL', () => {
    service.getProductTiers(ProductType.Synology).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/product/tiers/synology`);
    req.flush({ productType: ProductType.Synology, productTiers: [] });
  });
});