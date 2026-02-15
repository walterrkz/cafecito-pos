import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { AuthResponse } from '../../types/Auth';
import { CartService } from '../sales/cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private isAuth$ = new BehaviorSubject<boolean>(false);
  private isAdmin$ = new BehaviorSubject<boolean>(false);
  private userName$ = new BehaviorSubject<string | null>(null);
  private role$ = new BehaviorSubject<'admin' | 'vendor' | 'guest'>('guest');

  isAuthChanges$ = this.isAuth$.asObservable();
  isAdminChanges$ = this.isAdmin$.asObservable();
  userNameChanges$ = this.userName$.asObservable();
  roleChanges$ = this.role$.asObservable();

  constructor(
    private httpClient: HttpClient,
    private cartService: CartService,
  ) {
    this.syncAuthState();
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  get isAuthenticated(): boolean {
    return this.isAuth$.value;
  }

  get isAdmin(): boolean {
    return this.isAdmin$.value;
  }

  get role(): 'admin' | 'vendor' | 'guest' {
    return this.role$.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((auth) => {
          this.cartService.clearCart();
          this.setSession(auth);
        }),
      );
  }

  refreshTokens(): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}/refresh`, {
        refreshToken: this.refreshToken,
      })
      .pipe(tap((auth) => this.setSession(auth)));
  }

  logout(): Observable<void> {
    return this.httpClient
      .post<void>(`${this.apiUrl}/logout`, {
        refreshToken: this.refreshToken,
      })
      .pipe(
        finalize(() => {
          this.cartService.clearCart();
          this.clearSession();
        }),
      );
  }

  private setSession(auth: AuthResponse): void {
    localStorage.setItem('accessToken', auth.accessToken);
    localStorage.setItem('refreshToken', auth.refreshToken);
    this.syncAuthState();
  }

  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.syncAuthState();
  }

  private getTokenPayload(): any | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  public syncAuthState(): void {
    const payload = this.getTokenPayload();

    if (!payload) {
      this.isAuth$.next(false);
      this.isAdmin$.next(false);
      this.userName$.next(null);
      this.role$.next('guest');
      return;
    }

    const isTokenValid = payload.exp && Date.now() < payload.exp * 1000;

    if (!isTokenValid) {
      this.isAuth$.next(false);
      this.isAdmin$.next(false);
      this.userName$.next(null);
      this.role$.next('guest');
      return;
    }

    this.isAuth$.next(true);
    this.isAdmin$.next(payload.role === 'admin');
    this.userName$.next(payload.user_name ?? null);
    this.role$.next(payload.role ?? 'guest');
  }
}
