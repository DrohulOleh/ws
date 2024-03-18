import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { GENERIC_KEY_VALUE_INTERFACE, IUser } from '../types';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (this.auth.isAuthenticated()) {
      return of(true);
    } else {
      this.router.navigate(['/login'], { queryParams: { accessDenied: true } });
      return of(false);
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return this.canActivate(childRoute, state);
  }

  /* private _hasRole(data: GENERIC_KEY_VALUE_INTERFACE): boolean {
    let currentUserToken: string | null = this.auth.getToken();

    if (currentUserToken) {
      const userAvailableRoleList = jwtDecode<IUser>(currentUserToken).role;
      const hasRole = !!(data['role'] as string[])?.find((e) =>
        userAvailableRoleList.find((list: string) => list === e)
      );
    }
    return false;
  } */
}
