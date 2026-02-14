import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.syncAuthState();

  if (authService.isAuthenticated) {
    return true;
  }

  if (!authService.refreshToken) {
    return router.createUrlTree(['/login']);
  }

  return authService.refreshTokens().pipe(
    map(() => true),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    }),
  );
};
