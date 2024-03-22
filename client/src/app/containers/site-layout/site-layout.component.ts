import { Component } from '@angular/core';
import { navItems } from './_nav';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { GridModule, SidebarModule } from '@coreui/angular';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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
export class SiteLayoutComponent {
  public navItems = navItems;
}
