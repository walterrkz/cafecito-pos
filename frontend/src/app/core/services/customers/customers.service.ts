import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomersResponse } from '../../types/Customers';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly apiUrl = `${environment.apiUrl}/customers`;

  constructor(private httpClient: HttpClient) {}

  getCustomers(
    q?: string,
    page: number = 1,
    limit: number = 20,
  ): Observable<CustomersResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (q) {
      params = params.set('q', q);
    }

    return this.httpClient.get<CustomersResponse>(this.apiUrl, { params });
  }

  getCustomerById(id: string): Observable<void> {
    return this.httpClient.get<void>(`${this.apiUrl}/${id}`);
  }
}
