import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AuthGuardService: CanActivateFn = (route, state) => {
  let isauthenticated = inject(AuthService).isAuthenticated();
  let router = inject(Router);

  if (isauthenticated) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const LoginGuard: CanActivateFn = (route, state) => {
  let isauthenticated = inject(AuthService).isAuthenticated();
  let router = inject(Router);

  if (isauthenticated) {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};
