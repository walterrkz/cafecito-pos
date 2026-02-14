import { Component } from '@angular/core';
import { Customer, CustomersResponse } from '../../core/types/Customers';
import { CustomersService } from '../../core/services/customers/customers.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  imports: [FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  customers: Customer[] = [];
  total = 0;

  search = '';
  page = 1;
  limit = 20;

  loading = false;
  errors: string[] = [];

  constructor(
    private customersService: CustomersService,
    private router: Router,
  ) {
    this.loadCustomers();
  }

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
}
