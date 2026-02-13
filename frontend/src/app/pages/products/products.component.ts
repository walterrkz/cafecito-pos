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
  private createErrorTimeoutId?: number;

  createSuccess = false;
  private createSuccessTimeoutId?: number;

  showEditModal = false;

  editId = '';
  editName = '';
  editPrice = 0;
  editStock = 0;

  editLoading = false;
  editErrors: string[] = [];
  editSuccess = false;

  private editErrorTimeoutId?: number;
  private editSuccessTimeoutId?: number;

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
          this.createSuccess = true;

          if (this.createSuccessTimeoutId) {
            clearTimeout(this.createSuccessTimeoutId);
          }

          this.createSuccessTimeoutId = window.setTimeout(() => {
            this.resetCreateModal();
          }, 5000);

          this.loadProducts();
        },
        error: (err) => {
          this.createLoading = false;
          this.createErrors = this.parseErrors(err);

          if (this.createErrorTimeoutId) {
            clearTimeout(this.createErrorTimeoutId);
          }

          this.createErrorTimeoutId = window.setTimeout(() => {
            this.createErrors = [];
          }, 3000);
        },
      });
  }

  resetCreateModal(): void {
    this.showCreateModal = false;
    this.createSuccess = false;
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

  updateProduct(): void {
    this.editLoading = true;
    this.editErrors = [];

    this.productsService
      .updateProduct(this.editId, {
        price: this.editPrice,
        stock: this.editStock,
      })
      .subscribe({
        next: () => {
          this.editLoading = false;
          this.editSuccess = true;

          this.loadProducts();

          if (this.editSuccessTimeoutId) {
            clearTimeout(this.editSuccessTimeoutId);
          }

          this.editSuccessTimeoutId = window.setTimeout(() => {
            this.resetEditModal();
          }, 5000);
        },
        error: (err) => {
          this.editLoading = false;
          this.editErrors = this.parseErrors(err);

          if (this.editErrorTimeoutId) {
            clearTimeout(this.editErrorTimeoutId);
          }

          this.editErrorTimeoutId = window.setTimeout(() => {
            this.editErrors = [];
          }, 3000);
        },
      });
  }

  openEditModal(product: Product): void {
    this.editId = product.id;
    this.editName = product.name;
    this.editPrice = product.price;
    this.editStock = product.stock;

    this.editErrors = [];
    this.editSuccess = false;
    this.showEditModal = true;
  }

  resetEditModal(): void {
    this.showEditModal = false;
    this.editSuccess = false;
    this.editId = '';
    this.editName = '';
    this.editPrice = 0;
    this.editStock = 0;
  }
}
