import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse } from '../../types/Products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private httpClient: HttpClient) {}

  getProducts(
    q?: string,
    page: number = 1,
    limit: number = 20,
  ): Observable<ProductsResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (q) {
      params = params.set('q', q);
    }

    return this.httpClient.get<ProductsResponse>(this.apiUrl, { params });
  }

  createProduct(data: {
    name: string;
    price: number;
    stock: number;
  }): Observable<Product> {
    return this.httpClient.post<Product>(this.apiUrl, data);
  }

  updateProduct(
    id: string,
    data: {
      price: number;
      stock: number;
    },
  ): Observable<Product> {
    return this.httpClient.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
