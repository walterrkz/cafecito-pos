import { Component } from '@angular/core';
import { SalesService } from '../../core/services/sales/sales.service';
import { SaleListItem } from '../../core/types/Sales';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent {

  sales: SaleListItem[] = [];
  loading = false;
  errors: string[] = [];

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;

    this.salesService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errors = ['Failed to load sales'];
      }
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/sales', id]);
  }
}
