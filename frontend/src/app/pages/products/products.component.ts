import { Component } from '@angular/core';
import { Product, ProductsResponse } from '../../core/types/Products';
import { ProductsService } from '../../core/services/products/products.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-products',
  imports: [FormsModule, ProductCardComponent, ModalComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  standalone: true,
})
export class ProductsComponent {
  viewMode: 'admin' | 'vendor' = 'admin';

  products: Product[] = [];
  total = 0;
  search = '';
  page = 1;
  limit = 20;

  loading = false;
  errors: string[] = [];

  showCreateModal = false;

  newName = '';
  newPrice = 0;
  newStock = 0;

  createErrors: string[] = [];
  createLoading = false;

  constructor(
    private productsService: ProductsService,
    public authService: AuthService,
  ) {
    this.loadProducts();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'admin' ? 'vendor' : 'admin';
  }

  loadProducts(
    q: string = this.search,
    page: number = this.page,
    limit: number = this.limit,
  ): void {
    this.loading = true;
    this.errors = [];

    this.search = q ?? '';
    this.page = page || 1;
    this.limit = limit || 20;

    this.productsService
      .getProducts(this.search, this.page, this.limit)
      .subscribe({
        next: (response: ProductsResponse) => {
          this.products = response.data;
          this.total = response.total;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errors = this.parseErrors(err);
        },
      });
  }

  createProduct(): void {
    this.createLoading = true;
    this.createErrors = [];

    this.productsService
      .createProduct({
        name: this.newName,
        price: this.newPrice,
        stock: this.newStock,
      })
      .subscribe({
        next: () => {
          this.createLoading = false;
          this.showCreateModal = false;
          this.resetCreateForm();
          this.loadProducts();
        },
        error: (err) => {
          this.createLoading = false;
          this.createErrors = this.parseErrors(err);
        },
      });
  }

  private resetCreateForm(): void {
    this.newName = '';
    this.newPrice = 0;
    this.newStock = 0;
  }

  private parseErrors(err: any): string[] {
    if (Array.isArray(err?.error?.details)) {
      return err.error.details.map((d: any) => d?.message).filter(Boolean);
    }

    if (err?.error?.message) {
      return [err.error.message];
    }

    if (typeof err?.error?.error === 'string') {
      return [err.error.error];
    }

    return ['Failed to load products'];
  }
}
