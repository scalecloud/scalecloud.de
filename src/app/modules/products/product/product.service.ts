import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private readonly url = `${this.apiUrl}/product/tiers`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }


  getProductTiers(productType: ProductType): Observable<ProductTiersReply> {
    return this.http.get<ProductTiersReply>(this.url + "/" + productType.toString().toLowerCase(), this.httpOptions);
  }


}
