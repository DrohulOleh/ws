import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BiComponent,
  provideBi,
  withIcons,
  at,
  lock,
} from 'dfx-bootstrap-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [BiComponent, CommonModule, RouterLink, ReactiveFormsModule],
  providers: [provideBi(withIcons({ at, lock }))],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup | any;
  aSub: Subscription | any;

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {}

  ngOnDestroy(): void {}
}
