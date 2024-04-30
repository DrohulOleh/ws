import { Routes } from '@angular/router';
import {
  canActivate,
  canActivateChild,
  hasPermission,
} from './shared/classes/auth.guard';

import { AuthLayoutComponent } from './containers/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './containers/site-layout/site-layout.component';

import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { EUserRoles } from './shared/classes/types';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'registration', component: RegistrationPageComponent },
    ],
  },
  {
    path: '',
    component: SiteLayoutComponent,
    canActivate: [canActivate, canActivateChild],
    children: [
      {
        path: 'overview',
        component: OverviewPageComponent,
        canActivate: [hasPermission],
        data: { role: [EUserRoles.admin] },
      },
      { path: 'product', component: ProductPageComponent },
      { path: 'order', component: OrderPageComponent },
      { path: 'cart', component: CartPageComponent },
      {
        path: 'users',
        canActivate: [hasPermission],
        component: UsersPageComponent,
        data: { role: [EUserRoles.admin] },
      },
    ],
  },
  {
    path: 'profile/:id',
    component: ProfilePageComponent,
    canActivate: [canActivate, canActivateChild],
  },
  { path: '**', component: NotfoundPageComponent },
];
