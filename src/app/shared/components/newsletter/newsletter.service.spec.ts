import { TestBed } from '@angular/core/testing';

import { NewsletterService } from './newsletter.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('NewsletterService', () => {
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsletterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
