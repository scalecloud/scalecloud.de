import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
