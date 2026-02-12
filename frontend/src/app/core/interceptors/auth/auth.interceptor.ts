import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const accessToken = authService.accessToken;

  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (req.url.includes('/auth/refresh')) {
        return authService
          .logout()
          .pipe(switchMap(() => throwError(() => error)));
      }

      const refreshToken = authService.refreshToken;

      if (!refreshToken) {
        return authService
          .logout()
          .pipe(switchMap(() => throwError(() => error)));
      }

      return authService.refreshTokens().pipe(
        catchError((refreshError) => {
          return authService
            .logout()
            .pipe(switchMap(() => throwError(() => refreshError)));
        }),

        switchMap(() => {
          const newAccessToken = authService.accessToken;

          if (!newAccessToken) {
            return authService
              .logout()
              .pipe(switchMap(() => throwError(() => error)));
          }

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return next(retryReq);
        }),
      );
    }),
  );
};
