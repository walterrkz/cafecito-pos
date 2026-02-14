import { Component } from '@angular/core';
import { Customer, CustomersResponse } from '../../core/types/Customers';
import { CustomersService } from '../../core/services/customers/customers.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-customers',
  imports: [FormsModule, ModalComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  standalone: true,
})
export class CustomersComponent {

  /* ================================
     LIST STATE
  ================================== */

  customers: Customer[] = [];
  total = 0;

  search = '';
  page = 1;
  limit = 20;

  loading = false;
  errors: string[] = [];

  /* ================================
     CREATE MODAL STATE
  ================================== */

  showCreateModal = false;

  newName = '';
  newPhoneOrEmail = '';

  createLoading = false;
  createErrors: string[] = [];
  createSuccess = false;

  private createErrorTimeoutId?: number;
  private createSuccessTimeoutId?: number;

  /* ================================
     CONSTRUCTOR
  ================================== */

  constructor(
    private customersService: CustomersService,
    private router: Router,
  ) {
    this.loadCustomers();
  }

  /* ================================
     LIST METHODS
  ================================== */

  loadCustomers(
    q: string = this.search,
    page: number = this.page,
    limit: number = this.limit,
  ): void {

    this.loading = true;
    this.errors = [];

    this.search = q ?? '';
    this.page = page || 1;
    this.limit = limit || 20;

    this.customersService
      .getCustomers(this.search, this.page, this.limit)
      .subscribe({
        next: (response: CustomersResponse) => {
          this.customers = response.data;
          this.total = response.total;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errors = this.parseErrors(err);
        },
      });
  }

  viewCustomer(id: string): void {
    this.router.navigate(['/customers', id]);
  }

  /* ================================
     CREATE METHODS
  ================================== */

  createCustomer(): void {

    this.createLoading = true;
    this.createErrors = [];

    this.customersService
      .createCustomer({
        name: this.newName,
        phoneOrEmail: this.newPhoneOrEmail,
      })
      .subscribe({
        next: () => {
          this.createLoading = false;
          this.createSuccess = true;

          this.loadCustomers();

          this.clearTimeout(this.createSuccessTimeoutId);
          this.createSuccessTimeoutId = window.setTimeout(() => {
            this.resetCreateModal();
          }, 5000);
        },
        error: (err) => {
          this.createLoading = false;
          this.createErrors = this.parseErrors(err);

          this.clearTimeout(this.createErrorTimeoutId);
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
    this.newPhoneOrEmail = '';
  }

  /* ================================
     PRIVATE UTILITIES
  ================================== */

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
