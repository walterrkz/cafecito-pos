import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, map, Observable, tap } from 'rxjs';
import { AuthResponse } from '../../types/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private accessToken$ = new BehaviorSubject<string | null>(
    localStorage.getItem('access_token'),
  );

  private isAuth$ = new BehaviorSubject<boolean>(false);
  private isAdmin$ = new BehaviorSubject<boolean>(false);

  isAuthChanges$ = this.isAuth$.asObservable();
  isAdminChanges$ = this.isAdmin$.asObservable();

  constructor(private httpClient: HttpClient) {
    this.syncAuthState();
  }

  get accessToken(): string | null {
    return this.accessToken$.value;
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  get isAuthenticated(): boolean {
  return this.isAuth$.value;
}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(this.mapAuthResponse),
        tap((auth) => this.setSession(auth)),
      );
  }

  refreshTokens(): Observable<AuthResponse> {
    return this.httpClient
      .post<any>(`${this.apiUrl}/refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        map(this.mapAuthResponse),
        tap((auth) => this.setSession(auth)),
      );
  }

  logout(): Observable<void> {
    const refresh_token = this.refreshToken;

    return this.httpClient
      .post<void>(`${this.apiUrl}/logout`, { refresh_token })
      .pipe(
        finalize(() => {
          this.clearSession();
        }),
      );
  }

  private mapAuthResponse(tokens: any): AuthResponse {
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }

  private setSession(auth: AuthResponse): void {
    localStorage.setItem('access_token', auth.accessToken);
    localStorage.setItem('refresh_token', auth.refreshToken);
    this.accessToken$.next(auth.accessToken);

    this.syncAuthState();
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessToken$.next(null);

    this.syncAuthState();
  }

  private getTokenPayload(): any | null {
    const token = this.accessToken$.value;;
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  private syncAuthState(): void {
    const payload = this.getTokenPayload();

    if (!payload) {
      this.isAuth$.next(false);
      this.isAdmin$.next(false);
      return;
    }

    const isTokenValid = payload.exp && Date.now() < payload.exp * 1000;

    if (!isTokenValid) {
      this.isAuth$.next(false);
      this.isAdmin$.next(false);
      return;
    }

    this.isAuth$.next(true);
    this.isAdmin$.next(payload.role === 'admin');
  }
}
