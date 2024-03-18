import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  BadgeComponent,
  ContainerComponent,
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
    
    SidebarNavComponent,
    BadgeComponent,
    ContainerComponent,
  ],
  providers: [provideBi(withIcons({ personCircle, arrowRightSquare }))],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css',
})
export class SiteLayoutComponent {
  navItems = [
    {
      url: '/overview',
      name: 'Overview',
      iconComponent: { name: 'cil-chart' },
    },
    {
      url: '/products',
      name: 'Products',
      iconComponent: { name: 'cil-fastfood' },
    },
    { url: '/order', name: 'Orders', iconComponent: { name: 'cil-notes' } },
    { url: '/user', name: 'Users', iconComponent: { name: 'cil-user' } },
  ];
}
