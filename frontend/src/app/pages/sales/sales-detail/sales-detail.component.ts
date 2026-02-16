import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Sale } from '../../../core/types/Sales';
import { SalesService } from '../../../core/services/sales/sales.service';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './sales-detail.component.html',
  styleUrl: './sales-detail.component.css',
})
export class SalesDetailComponent {

  sale: Sale | null = null;

  constructor(
    private route: ActivatedRoute,
    private salesService: SalesService
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.salesService.getSaleById(id).subscribe({
        next: (data) => {
          this.sale = data;
        }
      });
    }
  }
}
