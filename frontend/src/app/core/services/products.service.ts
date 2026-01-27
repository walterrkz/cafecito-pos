import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../types/Products';

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
}
