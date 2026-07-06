import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { StripeKey, STRIPE_PUBLIC_KEY } from './stripe-key';
import { Log } from '../logging/log';

describe('StripeKey', () => {
  let stripeKey: StripeKey;

  const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  function configureWithKey(publicKey: string | undefined) {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: STRIPE_PUBLIC_KEY, useValue: publicKey },
        { provide: Log, useValue: log },
      ],
    });

    stripeKey = TestBed.inject(StripeKey);
  }

  describe('with a configured public key', () => {
    beforeEach(() => {
      configureWithKey('pk_test_123');
    });

    it('should be created', () => {
      expect(stripeKey).toBeTruthy();
    });

    it('should return the public key', () => {
      expect(stripeKey.getPublicKey()).toBe('pk_test_123');
    });

    it('should log an info message', () => {
      stripeKey.getPublicKey();
      expect(log.info).toHaveBeenCalledWith('Using Stripe public key');
      expect(log.error).not.toHaveBeenCalled();
    });
  });

  describe('without a configured public key', () => {
    beforeEach(() => {
      configureWithKey(undefined);
    });

    it('should return undefined', () => {
      expect(stripeKey.getPublicKey()).toBeUndefined();
    });

    it('should log an error message', () => {
      stripeKey.getPublicKey();
      expect(log.error).toHaveBeenCalledWith('Could not get Stripe public key.');
      expect(log.info).not.toHaveBeenCalled();
    });
  });

  describe('with an empty string public key', () => {
    beforeEach(() => {
      configureWithKey('');
    });

    it('should treat it as missing and return undefined', () => {
      expect(stripeKey.getPublicKey()).toBeUndefined();
    });

    it('should log an error message', () => {
      stripeKey.getPublicKey();
      expect(log.error).toHaveBeenCalledWith('Could not get Stripe public key.');
    });
  });
});