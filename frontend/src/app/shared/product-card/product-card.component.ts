import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../core/types/Products';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  standalone: true,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isAuth!: boolean;
  @Input() isAdmin!: boolean;
  @Input() viewMode!: 'admin' | 'vendor';

  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
}
