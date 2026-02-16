import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Sale, SaleListItem, SalePayload } from '../../types/Sales';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly apiUrl = `${environment.apiUrl}/sales`;

  constructor(private httpClient: HttpClient) {}

  createSale(payload: SalePayload): Observable<Sale> {
    return this.httpClient.post<Sale>(this.apiUrl, payload);
  }

  getSales(): Observable<SaleListItem[]> {
    return this.httpClient.get<SaleListItem[]>(this.apiUrl);
  }

  getSaleById(id: string): Observable<Sale> {
    return this.httpClient.get<Sale>(`${this.apiUrl}/${id}`);
  }
}
