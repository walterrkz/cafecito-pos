import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../../core/types/Products';
import { ProductsService } from '../../core/services/products/products.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [AsyncPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  standalone: true,
})
export class ProductsComponent {
  products$!: Observable<ProductsResponse>;

  constructor(private productsService: ProductsService) {
    this.loadProducts();
  }

  loadProducts(q?:string, page: number = 1, limit: number = 20) {
    this.products$ = this.productsService.getProducts(q, page, limit);
  }
}
