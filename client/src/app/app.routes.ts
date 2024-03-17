import { Routes } from '@angular/router';
import { AuthGuard } from './shared/classes/auth.guard';

import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { EUserRoles } from './shared/types';

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
    canActivate: [AuthGuard],
    children: [
      {
        path: 'overview',
        component: OverviewPageComponent,
        data: { role: [EUserRoles.admin] },
      },
      { path: 'products', component: ProductsPageComponent },
    ],
  },
];
