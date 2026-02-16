import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { loginGuard } from './core/guards/login/login.guard';
import { CustomersComponent } from './pages/customers/customers.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { CustomerDetailComponent } from './pages/customers/customer-detail/customer-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { SalesComponent } from './pages/sales/sales.component';
import { SalesDetailComponent } from './pages/sales/sales-detail/sales-detail.component';

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
    path: 'cart',
    component: CartComponent,
    canActivate:[authGuard]
  },
  {
  path: 'customers/:id',
  component: CustomerDetailComponent,
  canActivate: [authGuard],
},
  {
    path: 'sales',
    component: SalesComponent,
    canActivate:[authGuard]
  },
  {
    path: 'sales/:id',
    component: SalesDetailComponent,
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
