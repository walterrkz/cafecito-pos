import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/sales/cart.service';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
})
export class SidebarComponent {
  isAuth$;
  userName$;
  cartCount$;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
  ) {
    this.isAuth$ = this.authService.isAuthChanges$;
    this.userName$ = this.authService.userNameChanges$;
    this.cartCount$ = this.cartService.cartCount$;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
