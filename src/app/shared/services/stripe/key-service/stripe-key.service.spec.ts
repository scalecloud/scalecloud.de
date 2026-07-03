import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { StripeKeyService, STRIPE_PUBLIC_KEY } from './stripe-key.service';
import { LogService } from '../../log/log.service';

describe('StripeKeyService', () => {
  let service: StripeKeyService;

  const logService = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  function configureWithKey(publicKey: string | undefined) {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: STRIPE_PUBLIC_KEY, useValue: publicKey },
        { provide: LogService, useValue: logService },
      ],
    });

    service = TestBed.inject(StripeKeyService);
  }

  describe('with a configured public key', () => {
    beforeEach(() => {
      configureWithKey('pk_test_123');
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return the public key', () => {
      expect(service.getPublicKey()).toBe('pk_test_123');
    });

    it('should log an info message', () => {
      service.getPublicKey();
      expect(logService.info).toHaveBeenCalledWith('Using Stripe public key');
      expect(logService.error).not.toHaveBeenCalled();
    });
  });

  describe('without a configured public key', () => {
    beforeEach(() => {
      configureWithKey(undefined);
    });

    it('should return undefined', () => {
      expect(service.getPublicKey()).toBeUndefined();
    });

    it('should log an error message', () => {
      service.getPublicKey();
      expect(logService.error).toHaveBeenCalledWith('Could not get Stripe public key.');
      expect(logService.info).not.toHaveBeenCalled();
    });
  });

  describe('with an empty string public key', () => {
    beforeEach(() => {
      configureWithKey('');
    });

    it('should treat it as missing and return undefined', () => {
      expect(service.getPublicKey()).toBeUndefined();
    });

    it('should log an error message', () => {
      service.getPublicKey();
      expect(logService.error).toHaveBeenCalledWith('Could not get Stripe public key.');
    });
  });
});