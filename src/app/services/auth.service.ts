import { HttpClient, HttpContext } from '@angular/common/http';
import {
  DestroyRef,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { Login, LoginSuccess, LoginResponse } from '../interfaces/login';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IS_PUBLIC } from '../interceptors/jwt.interceptor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private jwtHelper = inject(JwtHelperService);

  private apiEndpoint = `${environment.apiBaseUrl}/auth`;

  private readonly destroyRef = inject(DestroyRef);
  private readonly TOKEN_EXPIRY_MINUTES = 5;
  private readonly CONTEXT = {
    context: new HttpContext().set(IS_PUBLIC, true),
  };

  get user(): WritableSignal<Usuario | null> {
    const token = localStorage.getItem('access_token');
    return signal(token ? this.jwtHelper.decodeToken(token) : null);
  }

  isAuthenticated() {
    return !this.jwtHelper.isTokenExpired();
  }

  scheduleTokenRefresh(token: string): void {
    const expirationTime = this.jwtHelper
      .getTokenExpirationDate(token)
      ?.getTime();
    const refreshTime = expirationTime
      ? expirationTime - this.TOKEN_EXPIRY_MINUTES * 60 * 1000
      : Date.now();
    const refreshInterval = refreshTime - Date.now();

    if (refreshInterval > 0) {
      setTimeout(() => {
        this.refreshToken()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }, refreshInterval);
    }
  }

  login(body: Login): Observable<LoginResponse> {
    console.log(body);
    return this.httpClient
      .post<LoginResponse>(`${this.apiEndpoint}/login`, body, this.CONTEXT)
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            // Handle invalid credentials
            console.error('Invalid credentials');
          }
          return of();
        }),
        tap((data) => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.access_token);
          this.router.navigate(['/dashboard']);
        })
      );
  }

  storeTokens(data: LoginSuccess): void {
    localStorage.setItem('access_token', data.access_token);
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      return of();
    }

    return this.httpClient
      .post<LoginResponse>(
        `${this.apiEndpoint}/token-refresh`,
        { refresh_token },
        this.CONTEXT
      )
      .pipe(
        catchError(() => of()),
        tap((data) => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.access_token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
