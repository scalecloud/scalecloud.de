import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { NEXTCLOUDPRODUCTS } from './nextcloud/mock-nextcloud-products';
import { NextcloudProduct } from './nextcloud/nextcloud-product';
import { SYNOLOGYPRODUCTS } from './synology/mock-synology-products';
import { SynologyProduct } from './synology/synology-product';


@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const nextcloudproducts: NextcloudProduct[] = NEXTCLOUDPRODUCTS;
    const synologyproducts: SynologyProduct[] = SYNOLOGYPRODUCTS;
    return { nextcloudproducts, synologyproducts };
  }

  genId(nextcloudProducts: NextcloudProduct[]): number {
    return nextcloudProducts.length > 0 ? Math.max(...nextcloudProducts.map(nextcloudProduct => nextcloudProduct.productId)) + 1 : 11;
  }
}
