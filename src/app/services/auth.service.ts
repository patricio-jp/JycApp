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
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IS_PUBLIC } from '../interceptors/jwt.interceptor';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Rol, Usuario } from '../interfaces/usuario';
import { NotificationsService } from './notifications.service';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private jwtHelper = inject(JwtHelperService);
  private notificationsService = inject(NotificationsService);
  private usersService = inject(UsuariosService);

  private apiEndpoint = `${environment.apiBaseUrl}/auth`;

  private readonly destroyRef = inject(DestroyRef);
  private readonly TOKEN_EXPIRY_MINUTES = 5;
  private readonly CONTEXT = {
    context: new HttpContext().set(IS_PUBLIC, true),
  };

  private userSignal = signal<Usuario | null>(null);

  get user(): WritableSignal<Usuario | null> {
    const token = localStorage.getItem('access_token');
    const userId = token ? this.jwtHelper.decodeToken(token).sub : null;

    if (this.userSignal()) return this.userSignal;

    if (userId) {
      this.usersService.getUsuario(userId).subscribe(
        (user) => this.userSignal.set(user),
        () => this.userSignal.set(null)
      );
    } else {
      this.userSignal.set(null);
    }

    return this.userSignal;
  }

  isAuthenticated() {
    return !this.jwtHelper.isTokenExpired();
  }

  getUserRole(): Rol | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      //console.log('Decoded Token: ', decodedToken);
      const roleIndex = decodedToken.rol;

      // Validar si el índice está dentro del enum
      if (roleIndex !== undefined && roleIndex in Rol) {
        return roleIndex as Rol;
      }
    }
    return null;
  }

  hasRole(role: Rol): boolean {
    return this.getUserRole() === role;
  }

  scheduleTokenRefresh(token: string): void {
    const expirationTime = this.jwtHelper
      .getTokenExpirationDate(token)
      ?.getTime();
    const refreshTime = expirationTime
      ? expirationTime - this.TOKEN_EXPIRY_MINUTES * 60 * 1000
      : Date.now();
    const refreshInterval = refreshTime - Date.now();

    //console.log('Token expiration time:', expirationTime);
    //console.log('Scheduled refresh time:', refreshTime);
    //console.log('Refresh interval:', refreshInterval);

    if (refreshInterval > 0) {
      setTimeout(() => {
        //console.log('Attempting to refresh token...');
        this.refreshToken()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }, refreshInterval);
    }
  }

  login(body: Login): Observable<LoginResponse> {
    //console.log(body);
    return this.httpClient
      .post<LoginResponse>(`${this.apiEndpoint}/login`, body, this.CONTEXT)
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            // Handle invalid credentials
            this.notificationsService.presentErrorToast(
              'Credenciales inválidas'
            );
            console.error('Invalid credentials');
          }
          return of();
        }),
        tap((data) => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.access_token);
          this.router.navigate(['/']);
        })
      );
  }

  storeTokens(data: LoginSuccess): void {
    if (data.access_token)
      localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token)
      localStorage.setItem('refresh_token', data.refresh_token);
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      //console.error('No refresh token available');
      return of();
    }

    //console.log('Refreshing token with refresh token:', refresh_token);
    const options = {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
      ...this.CONTEXT,
    };

    return this.httpClient
      .post<LoginResponse>(`${this.apiEndpoint}/token-refresh`, null, options)
      .pipe(
        catchError((error) => {
          console.error('Error refreshing token:', error);
          this.logout();
          return of();
        }),
        tap((data) => {
          const loginSuccessData = data as LoginSuccess;
          this.storeTokens(loginSuccessData);
          this.scheduleTokenRefresh(loginSuccessData.access_token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (!this.router.url.includes('/validarPago')) {
      this.router.navigate(['/login']);
    }
  }
}
