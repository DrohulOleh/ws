import { Routes } from '@angular/router';
import { canActivate, canActivateChild } from './shared/classes/auth.guard';

import { AuthLayoutComponent } from './containers/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './containers/site-layout/site-layout.component';

import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';

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
      { path: 'overview', component: OverviewPageComponent },
      { path: 'product', component: ProductPageComponent },
      { path: 'order', component: OrderPageComponent },
      { path: 'cart', component: CartPageComponent },
    ],
  },
  { path: '**', component: NotfoundPageComponent },
];
