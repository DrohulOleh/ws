import { Component, OnInit } from '@angular/core';
import { adminNavItems, userNavItems } from './_nav';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { GridModule, SidebarModule } from '@coreui/angular';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { EUserRoles } from '../../shared/classes/types';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    SidebarModule,
    RouterOutlet,
    GridModule,
    CommonModule,
  ],
  templateUrl: './site-layout.component.html',
})
export class SiteLayoutComponent implements OnInit {
  currentUserIsAdmin =
    this.authService.getUserPayload()?.role === EUserRoles.admin ? true : false;

  public navItems: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.currentUserIsAdmin) {
      this.navItems = adminNavItems;
    } else {
      this.navItems = userNavItems;
    }
  }
}
