import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';

import { AddSeatService } from './add-seat.service';
import { API_URL, APP_BASE_URL } from 'src/app/core/config/api.token';

describe('AddSeatService', () => {
  let service: AddSeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: API_URL, useValue: 'http://localhost' },
        { provide: APP_BASE_URL, useValue: 'http://localhost' },
      ],
    });
    service = TestBed.inject(AddSeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});