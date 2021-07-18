import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SYNOLOGYPRODUCTS } from './mock-synology-products';
import { SynologyProduct } from './synology-product';

@Injectable({
  providedIn: 'root'
})
export class SynologyProductService {

  constructor() { }

  getProducts(): Observable<SynologyProduct[]> {
    const synologyProducts = of(SYNOLOGYPRODUCTS);
    return synologyProducts;
  }

}