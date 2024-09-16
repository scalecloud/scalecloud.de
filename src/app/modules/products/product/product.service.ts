import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductTiersReply, ProductType } from '../product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = 'http://localhost:15000/product/tiers';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }


  getProductTiers(productType: ProductType): Observable<ProductTiersReply> {
    return this.http.get<ProductTiersReply>(this.url + "/" + productType.toString().toLowerCase(), this.httpOptions);
  }


}
