import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SidebarNavHelper } from '@coreui/angular';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), SidebarNavHelper],
};
