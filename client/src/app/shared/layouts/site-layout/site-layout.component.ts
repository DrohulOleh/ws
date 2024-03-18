import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BadgeComponent,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
} from '@coreui/angular';
import {
  BiComponent,
  provideBi,
  withIcons,
  personCircle,
  arrowRightSquare,
} from 'dfx-bootstrap-icons';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    BiComponent,
    RouterOutlet,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarFooterComponent,
    SidebarNavComponent,
    BadgeComponent,
  ],
  providers: [provideBi(withIcons({ personCircle, arrowRightSquare }))],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css',
})
export class SiteLayoutComponent {
  navItems = [
    { url: '/overview', name: 'Overview' },
    { url: '/products', name: 'Products' },
    { url: '/order', name: 'Orders' },
    { url: '/user', name: 'Users' },
  ];
  navItemOverview = [{ url: '/overview', name: 'Overview' }];
}
