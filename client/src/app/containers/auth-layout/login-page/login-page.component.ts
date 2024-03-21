import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  InputGroupComponent,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormModule,
    GridModule,
    IconModule,
    InputGroupComponent,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {}
