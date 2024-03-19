import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './containers/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './containers/site-layout/site-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';

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
    children: [
      { path: 'overview', component: OverviewPageComponent },
      { path: 'product', component: ProductPageComponent },
      { path: 'order', component: OrderPageComponent },
    ],
  },
];
