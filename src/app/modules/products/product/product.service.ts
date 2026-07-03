import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductTiersReply, ProductType } from '../product-model';
import { API_URL } from 'src/app/core/config/api.token';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  private readonly tiersUrl = `${this.apiUrl}/product/tiers`;

  getProductTiers(productType: ProductType): Observable<ProductTiersReply> {
    const segment = productType.toString().toLowerCase();
    return this.http.get<ProductTiersReply>(`${this.tiersUrl}/${segment}`);
  }
}