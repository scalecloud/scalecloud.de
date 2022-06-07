import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor() { }

  checkout( productID: string ): void {
    console.log('Checkout with productID: ' + productID);
  }

}
