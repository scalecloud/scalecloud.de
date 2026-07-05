import { Injectable, inject, InjectionToken } from '@angular/core';
import { Log } from '../logging/log';

export const STRIPE_PUBLIC_KEY = new InjectionToken<string>('STRIPE_PUBLIC_KEY');

@Injectable({
  providedIn: 'root'
})
export class StripeKeyService {
  private readonly publicKey = inject(STRIPE_PUBLIC_KEY);
  private readonly logService = inject(Log);


  getPublicKey(): string | undefined {
    if (!this.publicKey) {
      this.logService.error('Could not get Stripe public key.');
      return undefined;
    }

    this.logService.info('Using Stripe public key');
    return this.publicKey;
  }
}
