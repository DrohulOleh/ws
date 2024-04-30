import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EUserRoles } from './types';

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { accessDenied: true } });
    return false;
  }
};

export const canActivateChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return canActivate(route, state);
};

export const hasPermission: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles: EUserRoles[] = route.data['role'];

  if (!expectedRoles) {
    console.log('no permission');
    router.navigate(['/product']);
    return false;
  } else {
    return authService.hasPermission(expectedRoles);
  }
};
