import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NEXTCLOUDPRODUCTS } from './mock-nextcloud-products';
import { NextcloudProduct } from './nextcloud-product';

@Injectable({
  providedIn: 'root'
})
export class NextcloudProductService {

  constructor() { }

  getNextcloudProducts(): Observable<NextcloudProduct[]> {
    const nextcloudProducts = of(NEXTCLOUDPRODUCTS);
    return nextcloudProducts;
  }

}