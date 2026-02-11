import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  constructor(private authService: AuthService) {
    this.isAuth$ = this.authService.isAuthChanges$;
    this.userName$ = this.authService.userNameChanges$;
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
