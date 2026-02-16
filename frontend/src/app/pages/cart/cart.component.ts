import { Component } from '@angular/core';
import { CartService } from '../../core/services/sales/cart.service';
import { CartItem, Sale } from '../../core/types/Sales';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Customer } from '../../core/types/Customers';
import { CustomersService } from '../../core/services/customers/customers.service';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../core/services/sales/sales.service';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, FormsModule, ModalComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  standalone: true,
})
export class CartComponent {
  constructor(
    public cartService: CartService,
    private customersService: CustomersService,
    private salesService: SalesService,
  ) {}

  customerSearch = '';
  customerEnabled = false;

  customers: Customer[] = [];
  customersLoading = false;
  customersErrors: string[] = [];

  selectedCustomerId: string | null = null;
  customersErrorTimeoutId?: number;

  paymentMethod: 'cash' | 'card' | 'transfer' = 'cash';

  saleLoading = false;
  saleErrors: string[] = [];
  saleSuccess = false;

  private saleErrorTimeoutId?: number;
  private saleSuccessTimeoutId?: number;

  createdSale: Sale | null = null;
  showTicketModal = false;

  get items(): CartItem[] {
    return this.cartService.items;
  }

  get totalAmount(): number {
    return this.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );
  }

  remove(productId: string): void {
    this.cartService.removeProduct(productId);
  }

  clear(): void {
    this.cartService.clearCart();
  }

  toggleCustomer(): void {
    this.customerEnabled = !this.customerEnabled;

    if (this.customerEnabled && this.customers.length === 0) {
      this.loadCustomers();
    }

    if (!this.customerEnabled) {
      this.selectedCustomerId = null;
    }
  }

  loadCustomers(q: string = this.customerSearch): void {
    this.customersLoading = true;
    this.customersErrors = [];

    this.customerSearch = q ?? '';

    const limit = 10000;

    this.customersService
      .getCustomers(this.customerSearch, 1, limit)
      .subscribe({
        next: (response) => {
          this.customers = response.data;
          this.customersLoading = false;
        },
        error: (err) => {
          this.customersLoading = false;
          this.customersErrors = this.parseErrors(err);

          this.clearTimeout(this.customersErrorTimeoutId);

          this.customersErrorTimeoutId = window.setTimeout(() => {
            this.customersErrors = [];
          }, 3000);
        },
      });
  }

  completeSale(): void {
    if (this.items.length === 0) return;

    this.saleLoading = true;
    this.saleErrors = [];

    const payload = this.cartService.getSalePayload(
      this.selectedCustomerId ?? undefined,
      this.paymentMethod,
    );

    this.salesService.createSale(payload).subscribe({
      next: (sale) => {
        this.saleLoading = false;
        this.saleSuccess = true;
        this.createdSale = sale;

        this.clearTimeout(this.saleSuccessTimeoutId);

        this.saleSuccessTimeoutId = window.setTimeout(() => {
          this.saleSuccess = false;
          this.showTicketModal = true;
        }, 2000);
      },
      error: (err) => {
        this.saleLoading = false;
        this.saleErrors = this.parseErrors(err);

        this.clearTimeout(this.saleErrorTimeoutId);

        this.saleErrorTimeoutId = window.setTimeout(() => {
          this.saleErrors = [];
        }, 3000);
      },
    });
  }

  closeTicket(): void {
    this.showTicketModal = false;
    this.cartService.clearCart();
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

    return ['Unexpected error'];
  }

  private clearTimeout(timeoutId?: number): void {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
}
