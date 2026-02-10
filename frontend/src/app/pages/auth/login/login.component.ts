import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errors: string[] = [];

  private errorTimeoutId?: number;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errors = [];

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading = false;
        this.errors = this.parseErrors(err);

        if (this.errorTimeoutId !== undefined) {
          clearTimeout(this.errorTimeoutId);
        }

        this.errorTimeoutId = window.setTimeout(() => {
          this.errors = [];
        }, 3000);
      },
    });
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

    return ['Login failed'];
  }
}
