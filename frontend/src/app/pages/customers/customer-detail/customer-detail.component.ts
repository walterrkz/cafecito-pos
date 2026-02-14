import { Component } from '@angular/core';
import { Customer } from '../../../core/types/Customers';
import { CustomersService } from '../../../core/services/customers/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  imports: [DatePipe],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
  standalone: true,
})
export class CustomerDetailComponent {
  customer: Customer = {
    id: '',
    name: '',
    phoneOrEmail: '',
    purchasesCount: 0,
    createdAt: '',
    updatedAt: '',
  };

  loading = false;
  errors: string[] = [];

  constructor(
    private customersService: CustomersService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loadCustomer();
  }

  loadCustomer(): void {
    this.loading = true;
    this.errors = [];

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.errors = ['Invalid customer id'];
      return;
    }

    this.customersService.getCustomerById(id).subscribe({
      next: (customer: Customer) => {
        this.customer = customer;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errors = this.parseErrors(err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
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
