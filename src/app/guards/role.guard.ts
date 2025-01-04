import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../interfaces/usuario';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Rol[];
  const userRole = authService.getUserRole();

  //console.log('User Role:', userRole);
  //console.log('Required Roles:', requiredRoles);

  if (requiredRoles.some((role) => authService.hasRole(role))) {
    return true;
  }
  router.navigate(['/unauthorized']);
  return false;
};
