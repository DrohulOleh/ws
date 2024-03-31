import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  ClassToggleService,
  DropdownModule,
  FormModule,
  GridModule,
  HeaderComponent,
  HeaderModule,
  ListGroupModule,
  NavModule,
  SharedModule,
  SidebarModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [
    // BreadcrumbModule,
    AvatarModule,
    BadgeModule,
    ButtonGroupModule,
    ButtonModule,
    CommonModule,
    DropdownModule,
    FormModule,
    GridModule,
    HeaderModule,
    IconModule,
    ListGroupModule,
    NavModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    SidebarModule,
  ],
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = 'sidebar';
  currentUserId = this.auth.getUserPayload()?.userId;

  constructor(
    private auth: AuthService,
    private router: Router,
    public cart: CartService,
    private classToggler: ClassToggleService
  ) {
    super();
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
