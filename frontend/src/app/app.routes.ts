import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { loginGuard } from './core/guards/login/login.guard';
import { CustomersComponent } from './pages/customers/customers.component';
import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate:[loginGuard]
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate:[authGuard]
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
