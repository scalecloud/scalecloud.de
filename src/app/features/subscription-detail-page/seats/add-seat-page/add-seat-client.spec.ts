import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';
import { API_URL, APP_BASE_URL } from 'src/app/core/config/api-token';
import { AddSeatClient } from './add-seat-client';

describe('AddSeatClient', () => {
  let service: AddSeatClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: API_URL, useValue: 'http://localhost' },
        { provide: APP_BASE_URL, useValue: 'http://localhost' },
      ],
    });
    service = TestBed.inject(AddSeatClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});