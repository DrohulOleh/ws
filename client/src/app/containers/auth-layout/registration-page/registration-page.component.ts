import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  InputGroupComponent,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormModule,
    GridModule,
    IconModule,
    InputGroupComponent,
    RouterLink,
  ],
  templateUrl: './registration-page.component.html',
})
export class RegistrationPageComponent {}
